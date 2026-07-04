import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import { getClientIp, isRateLimited, rateLimitResponse } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  if (isRateLimited(`verify-email-token:${getClientIp(req)}`, 10))
    return rateLimitResponse();

  const body = await req.json().catch(() => ({}));
  const { token } = body;

  if (!token || typeof token !== "string")
    return NextResponse.json({ message: "Token is required" }, { status: 400 });

  const result = await bffFetch<{ purpose: string }>("/api/Auth/verify-email-token", req, {
    isPublic: true,
    method: "POST",
    body: { Token: token },
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
