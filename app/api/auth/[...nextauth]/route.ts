import { handlers } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getClientIp, isRateLimited } from "@/lib/rateLimit";

export const GET = handlers.GET;

export async function POST(req: NextRequest) {
  if (req.nextUrl.pathname === "/api/auth/callback/credentials") {
    if (isRateLimited(`login:${getClientIp(req)}`)) {
      // NextAuth's signIn() does new URL(data.url) on the response — must be a valid URL.
      // Encoding the error in the search param is how NextAuth surfaces result.error to the caller.
      return NextResponse.json(
        { url: `${req.nextUrl.origin}/login?error=TooManyRequests` },
        { status: 429 },
      );
    }
  }
  return handlers.POST(req);
}
