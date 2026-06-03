import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { Review } from "@/app/types/api";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const formData = await req.formData();

  const result = await bffFetch<Review>(`/api/Reviews/${id}/images`, {
    isPublic: false,
    method: "POST",
    cache: "no-store",
    rawBody: formData,
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
