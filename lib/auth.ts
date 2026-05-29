import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { isRateLimited } from "@/lib/rateLimit";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5025";

// Deduplicates concurrent refresh calls for the same user within this server process.
// Without this, parallel requests with an expired token each call /refresh independently,
// causing token rotation failures (401) for all but the first.
const pendingRefreshes = new Map<string, Promise<JWT>>();

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
    return {
      ...token,
      backendAccessToken: data.accessToken,
      backendRefreshToken: data.refreshToken,
      backendTokenExpiry: data.accessTokenExpiry,
      error: undefined,
    };
  } catch {
    console.log("[auth] Token refresh FAILED");
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

async function refreshBackendToken(token: JWT): Promise<JWT> {
  const userId = token.userId;
  const pending = pendingRefreshes.get(userId);
  if (pending) return pending;

  const promise = doRefreshBackendToken(token);
  pendingRefreshes.set(userId, promise);
  try {
    return await promise;
  } finally {
    pendingRefreshes.delete(userId);
  }
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
        await fetch(`${BACKEND_URL}/api/Auth/logout`, {
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
