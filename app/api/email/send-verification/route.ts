import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { OtpResponse } from "@/app/types/api";

export async function POST(req: NextRequest) {
  const result = await bffFetch<OtpResponse>("/api/Auth/send-email-verification", req, {
    isPublic: false,
    method: "POST",
    body: {},
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
