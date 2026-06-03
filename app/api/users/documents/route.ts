import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { UserDocument } from "@/app/types/api";

export async function GET(req: NextRequest) {
  const result = await bffFetch<UserDocument[]>("/api/Users/me/documents", {
    isPublic: false,
    method: "GET",
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
