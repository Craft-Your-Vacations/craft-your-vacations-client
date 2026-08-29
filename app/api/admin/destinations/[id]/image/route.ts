import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { Destination } from "@/app/types/api";

// Admin: replace a destination's hero image. The file goes straight through to
// .NET, which stores it in R2 and returns the destination with its new URL.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const formData = await req.formData();

  const result = await bffFetch<Destination>(`/api/destinations/${id}/image`, req, {
    isPublic: false,
    method: "POST",
    cache: "no-store",
    rawBody: formData,
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
