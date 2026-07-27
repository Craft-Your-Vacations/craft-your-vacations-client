import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { OtpResponse } from "@/app/types/api";

export async function POST(req: NextRequest) {
  const { identifier } = await req.json();

  const result = await bffFetch<OtpResponse>("/api/auth/start-reset", req, {
    isPublic: true,
    method: "POST",
    body: { identifier: identifier },
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
