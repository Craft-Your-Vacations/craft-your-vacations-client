import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { Review } from "@/app/types/api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit");
  const path = limit ? `/api/Reviews/approved?limit=${limit}` : "/api/Reviews/approved";

  const result = await bffFetch<Review[]>(path, req, {
    isPublic: true,
    cache: { revalidate: 60, tags: ["reviews"] }, // 1-min ISR; admin approvals are infrequent but should surface quickly
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
