import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { OtpResponse } from "@/app/types/api";
import { getClientIp, isRateLimited, rateLimitResponse } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  if (isRateLimited(`start-reset:${getClientIp(req)}`, 5))
    return rateLimitResponse();
  const { identifier } = await req.json();

  const result = await bffFetch<OtpResponse>("/api/Auth/start-reset", req, {
    isPublic: true,
    method: "POST",
    body: { identifier: identifier },
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
