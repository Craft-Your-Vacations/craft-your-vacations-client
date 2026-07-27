import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { encode } from "next-auth/jwt";
import { cookies } from "next/headers";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5025";

// v4 session cookie name — matches what next-auth uses internally.
// In v4, session tokens are encoded with salt="" (empty string).
// See next-auth/src/jwt/index.ts: "empty salt means a session token".
const SESSION_COOKIE =
  process.env.NEXTAUTH_URL?.startsWith("https://") || !!process.env.VERCEL
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";

// Deduplicates concurrent refresh calls within this server process.
// Keyed by refreshToken (not userId) so late-arriving requests that carry the same
// already-consumed refresh token find the cached result instead of re-attempting a
// dead refresh. The 10s grace period covers the window between the server writing the
// Set-Cookie header and the browser receiving it and sending the updated cookie.
const pendingRefreshes = new Map<string, Promise<JWT>>();

async function doRefreshBackendToken(token: JWT): Promise<JWT> {
  console.log("[auth] Refresh Token", token.backendRefreshToken);

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.backendRefreshToken }),
    });
    if (!res.ok) throw new Error("Refresh failed");
    console.log("[auth] Refreshed backend token successfully");
    const data = await res.json();
    const refreshed: JWT = {
      ...token,
      backendAccessToken: data.accessToken,
      backendRefreshToken: data.refreshToken,
      backendTokenExpiry: data.accessTokenExpiry,
      error: undefined,
    };

    // Write the refreshed token back to the session cookie immediately.
    // getServerSession() in App Router route handlers has no response object,
    // so the jwt callback's updated token is never written back. Without this,
    // every sequential request arrives with the stale (already rotated) refresh
    // token and .NET rejects it. This write fixes that for any number of instances.
    try {
      const encoded = await encode({
        token: refreshed,
        secret: process.env.NEXTAUTH_SECRET!,
        // v4: salt="" means session token (next-auth/src/jwt/index.ts line 18)
        salt: "",
      });
      // next-auth chunks cookies > 3936 bytes across multiple cookie names (.0, .1, ...).
      // Our single cookies().set() only writes the base name — guard here so any
      // future payload growth fails loudly instead of silently corrupting the session.
      if (encoded.length > 3936) {
        console.error(
          `[auth] Encoded session token is ${encoded.length} bytes — exceeds the 3936-byte chunk threshold. Cookie NOT written.`,
        );
      } else {
        (await cookies()).set(SESSION_COOKIE, encoded, {
          httpOnly: true,
          secure: SESSION_COOKIE.startsWith("__Secure-"),
          sameSite: "lax",
          path: "/",
          maxAge: 30 * 24 * 60 * 60,
        });
        console.log("[auth] Session cookie updated after token refresh");
      }
    } catch (cookieErr) {
      // Non-fatal — pendingRefreshes still prevents concurrent double-refreshes.
      console.log("[auth] Could not write session cookie:", cookieErr);
    }

    return refreshed;
  } catch {
    console.log("[auth] Token refresh FAILED");
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

async function refreshBackendToken(token: JWT): Promise<JWT> {
  const key = token.backendRefreshToken as string;
  const pending = pendingRefreshes.get(key);
  if (pending) return pending;

  const promise = doRefreshBackendToken(token);
  pendingRefreshes.set(key, promise);
  // Keep the resolved promise for 10 seconds so late-arriving requests with the same
  // (already consumed) refresh token reuse the cached result rather than hitting .NET.
  // On network failure, doRefreshBackendToken resolves with error — still cache it
  // briefly to avoid hammering a down backend, but clear sooner (2s).
  promise.then((result) => {
    const ttl = result.error ? 2_000 : 10_000;
    setTimeout(() => pendingRefreshes.delete(key), ttl);
  });
  return promise;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        // Forward client IP so .NET can rate-limit by real client IP.
        const loginHeaders: Record<string, string> = {
          "Content-Type": "application/json",
        };
        const forwarded = req?.headers?.["x-forwarded-for"];
        if (forwarded) {
          loginHeaders["X-Forwarded-For"] = Array.isArray(forwarded)
            ? forwarded[0]
            : forwarded;
        }

        let res: Response;
        try {
          res = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: "POST",
            headers: loginHeaders,
            body: JSON.stringify({
              Username: credentials.email,
              Password: credentials.password,
            }),
          });
        } catch (err) {
          throw new Error("ServiceUnavailable");
        }

        if (!res.ok) {
          if (res.status >= 500) throw new Error("ServiceUnavailable");
          const errorBody = await res.json().catch(() => ({}));
          throw new Error(errorBody.message ?? "Invalid email or password.");
        }

        const user = await res.json();
        return {
          id: String(user.userId),
          email: credentials.email,
          name: user.name ?? null,
          image: user.image ?? null,
          phoneVerified: user.phoneVerified ?? false,
          role: user.role ?? "Customer",
          backendAccessToken: user.accessToken,
          backendRefreshToken: user.refreshToken,
          backendTokenExpiry: user.accessTokenExpiry,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  events: {
    async signOut({ token }) {
      if (!token?.backendRefreshToken) return;
      try {
        await fetch(`${BACKEND_URL}/api/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: token.backendRefreshToken }),
        });
      } catch {
        // best-effort — never block sign-out if the backend call fails
        console.log("Logout call failed.");
      }
    },
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const res = await fetch(`${BACKEND_URL}/api/auth/google-signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              Name: user.name,
              Email: user.email,
              MobileNumber: null,
              Image: user.image,
            }),
          });
          if (!res.ok) {
            console.error(
              "[signIn] /google-signin failed:",
              res.status,
              await res.text(),
            );
            return "/login?error=ServiceUnavailable";
          }
          const backendUser = await res.json();

          user.id = String(backendUser.userId);
          user.phoneVerified = backendUser.phoneVerified ?? false;
          user.role = backendUser.role ?? "Customer";
          user.backendAccessToken = backendUser.accessToken;
          user.backendRefreshToken = backendUser.refreshToken;
          user.backendTokenExpiry = backendUser.accessTokenExpiry;
        } catch (err) {
          console.error("[signIn] fetch threw:", err);
          return "/login?error=ServiceUnavailable";
        }
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      // Client-side session update (e.g. after OTP verification)
      if (trigger === "update" && session) {
        const { role: _role, ...safeSession } = session;
        return { ...token, ...safeSession };
      }
      // Initial login — store backend tokens
      if (user) {
        token.userId = user.id;
        token.phoneVerified = user.phoneVerified ?? false;
        token.role = user.role ?? "Customer";
        token.backendAccessToken = user.backendAccessToken!;
        token.backendRefreshToken = user.backendRefreshToken!;
        token.backendTokenExpiry = user.backendTokenExpiry!;
        return token;
      }

      const now = Date.now();
      const expiry = (token.backendTokenExpiry - 60) * 1000;

      if (now < expiry) return token;

      // Token expiring/expired — attempt refresh
      return refreshBackendToken(token);
    },

    async session({ session, token }) {
      session.user.userId = token.userId as string;
      session.user.phoneVerified = token.phoneVerified ?? false;
      session.user.role = token.role;
      if (token.error) session.error = token.error;
      return session;
    },
  },
};
