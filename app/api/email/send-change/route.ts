import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { OtpResponse } from "@/app/types/api";

export async function POST(req: NextRequest) {
  const { newEmail } = await req.json();

  const result = await bffFetch<OtpResponse>("/api/auth/send-change-email", req, {
    isPublic: false,
    method: "POST",
    body: { NewEmail: newEmail },
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
