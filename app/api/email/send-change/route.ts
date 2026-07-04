import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { OtpResponse } from "@/app/types/api";
import { getClientIp, isRateLimited, rateLimitResponse } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  if (isRateLimited(`send-email-change:${getClientIp(req)}`, 3))
    return rateLimitResponse();

  const { newEmail } = await req.json();

  const result = await bffFetch<OtpResponse>("/api/Auth/send-change-email", req, {
    isPublic: false,
    method: "POST",
    body: { NewEmail: newEmail },
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
