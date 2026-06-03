import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { encode } from "next-auth/jwt";
import { cookies } from "next/headers";
import type { JWT } from "next-auth/jwt";
import { isRateLimited } from "@/lib/rateLimit";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5025";

// Deduplicates concurrent refresh calls for the same user within this server process.
// Handles parallel requests that all arrive with an expired token simultaneously.
const pendingRefreshes = new Map<string, Promise<JWT>>();

// The session cookie name Auth.js v5 uses.
const SESSION_COOKIE =
  process.env.NODE_ENV === "production"
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

async function doRefreshBackendToken(token: JWT): Promise<JWT> {
  // Per-user rate limit — refresh is server-to-server so no client IP is available.
  // 10/min per userId is very generous (normal refresh cadence is once per 15 min)
  // but stops runaway refresh loops from broken clients or stolen refresh tokens.
  if (isRateLimited(`refresh:${token.userId}`, 10)) {
    console.log("[auth] Refresh rate limited for user", token.userId);
    return { ...token, error: "RefreshAccessTokenError" };
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/Auth/refresh`, {
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
    // auth() in custom Route Handlers reads but never re-encodes the cookie, so
    // without this write every sequential request arrives with the stale (already
    // rotated) refresh token and .NET rejects it. Writing here fixes that for any
    // number of server instances — the browser receives the Set-Cookie header and
    // all future requests carry the new token regardless of which instance handles them.
    try {
      const encoded = await encode({
        token: refreshed,
        secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET!,
        salt: SESSION_COOKIE,
      });
      // Auth.js chunks cookies larger than 3936 bytes across multiple cookie names
      // (authjs.session-token.0, .1, ...). Our single cookies().set() call only writes
      // the base name — if chunking were needed the session would be unreadable.
      // Guard here so any future payload growth fails loudly, not silently.
      if (encoded.length > 3936) {
        console.error(
          `[auth] Encoded session token is ${encoded.length} bytes — exceeds the 3936-byte chunk threshold. Cookie NOT written. Add less data to the JWT payload.`,
        );
      } else {
        (await cookies()).set(SESSION_COOKIE, encoded, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
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
  console.log(
    `[auth] Refreshing backend token with token ${token.backendRefreshToken} for user ${token.userId}`,
  );

  const userId = token.userId as string;
  const pending = pendingRefreshes.get(userId);
  if (pending) {
    console.log(
      "[auth] Refresh already in progress, returning pending promise for user",
      userId,
    );
    return pending;
  }

  const promise = doRefreshBackendToken(token);
  pendingRefreshes.set(userId, promise);
  try {
    return await promise;
  } finally {
    pendingRefreshes.delete(userId);
  }
}

export const {
  handlers,
  auth,
  signIn: serverSignIn,
  signOut: serverSignOut,
} = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        let res: Response;
        try {
          res = await fetch(`${BACKEND_URL}/api/Auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              Username: credentials.email,
              Password: credentials.password,
            }),
          });
        } catch {
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
          email: credentials.email as string,
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
    async signOut(message) {
      // In v5 JWT sessions, message is { token: JWT }
      if (!("token" in message) || !message.token?.backendRefreshToken) return;
      try {
        await fetch(`${BACKEND_URL}/api/Auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            refreshToken: message.token.backendRefreshToken,
          }),
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
          const res = await fetch(`${BACKEND_URL}/api/Auth/google-signin`, {
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
        token.userId = user.id!;
        token.phoneVerified = user.phoneVerified ?? false;
        token.role = user.role ?? "Customer";
        token.backendAccessToken = user.backendAccessToken!;
        token.backendRefreshToken = user.backendRefreshToken!;
        token.backendTokenExpiry = user.backendTokenExpiry!;
        return token;
      }

      const now = Date.now();
      const expiry = (token.backendTokenExpiry - 20) * 1000;

      if (now < expiry) return token;

      console.log("Backend access token expired or expiring soon, refreshing...", expiry);
      // Token expiring/expired — attempt refresh
      return refreshBackendToken(token);
    },

    async session({ session, token }) {
      session.user.userId = token.userId as string;
      session.user.phoneVerified = token.phoneVerified ?? false;
      session.user.role = token.role;
      // Expose for server-side BFF use only (bffFetch Authorization header).
      // Never use session.backendAccessToken in client components.
      session.backendAccessToken = token.backendAccessToken;
      if (token.error) session.error = token.error;
      return session;
    },
  },
});
