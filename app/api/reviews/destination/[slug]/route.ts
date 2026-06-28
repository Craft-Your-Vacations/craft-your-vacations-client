import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { Review } from "@/app/types/api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const result = await bffFetch<Review[]>(`/api/Reviews/destination/${slug}`, req, {
    isPublic: true,
    cache: { revalidate: 60, tags: ["reviews"] }, // 1-min ISR; review list changes infrequently
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
