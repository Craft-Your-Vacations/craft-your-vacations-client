import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { OtpResponse } from "@/app/types/api";

export async function POST(req: NextRequest) {
  const { identifier, otp, newPassword } = await req.json();

  const result = await bffFetch<OtpResponse>("/api/Auth/reset-password", req, {
    isPublic: true,
    method: "POST",
    body: {
      identifier: identifier,
      otp: otp,
      newPassword: newPassword,
    },
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
