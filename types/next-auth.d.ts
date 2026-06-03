import "next-auth";
import "next-auth/jwt";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    phoneVerified?: boolean;
    role?: string;
    backendAccessToken?: string;
    backendRefreshToken?: string;
    backendTokenExpiry?: number;
  }

  interface Session {
    /** Server-side BFF use only — never read from client components. */
    backendAccessToken: string;
    user: {
      userId: string;
      phoneVerified: boolean;
      role?: string;
    } & DefaultSession["user"];
    error?: "RefreshAccessTokenError";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    phoneVerified: boolean;
    role?: string;
    backendAccessToken: string;
    backendRefreshToken: string;
    backendTokenExpiry: number;
    error?: "RefreshAccessTokenError";
  }
}
