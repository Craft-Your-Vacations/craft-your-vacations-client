import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { OtpResponse } from "@/app/types/api";

export async function POST(req: NextRequest) {
  const { mobileNumber, otp } = await req.json();

  const result = await bffFetch<OtpResponse>("/api/Auth/verify-otp", {
    isPublic: false,
    method: "POST",
    body: {
      MobileNumber: mobileNumber,
      Otp: otp,
    },
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  
  return NextResponse.json(result.data);
}
