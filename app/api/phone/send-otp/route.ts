import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { OtpResponse } from "@/app/types/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getClientIp, isRateLimited, rateLimitResponse } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  if (isRateLimited(`send-otp:${getClientIp(req)}`, 5)) return rateLimitResponse();
  const { mobileNumber } = await req.json();

  const session = await getServerSession(authOptions);
  const result = await bffFetch<OtpResponse>("/api/Auth/send-otp", req, {
    isPublic: true,
    method: "POST",
    body: { mobileNumber: mobileNumber },
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
