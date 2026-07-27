import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { token } = body;

  if (!token || typeof token !== "string")
    return NextResponse.json({ message: "Token is required" }, { status: 400 });

  const result = await bffFetch<boolean>("/api/auth/verify-email-token", req, {
    isPublic: true,
    method: "POST",
    body: { Token: token },
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
