import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { OtpResponse } from "@/app/types/api";
import { getClientIp, isRateLimited, rateLimitResponse } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  if (isRateLimited(`send-otp:${getClientIp(req)}`, 5)) return rateLimitResponse();
  const { mobileNumber } = await req.json();

  const result = await bffFetch<OtpResponse>("/api/Auth/send-otp", req, {
    isPublic: true,
    method: "POST",
    body: { mobileNumber: mobileNumber },
    cache: "no-store",
  });

  if (!result.ok) {
    if (result.response.status >= 500)
      return NextResponse.json(
        { message: "Failed to send OTP. Please try again later." },
        { status: 500 },
      );
    return result.response;
  }
  return NextResponse.json(result.data);
}
