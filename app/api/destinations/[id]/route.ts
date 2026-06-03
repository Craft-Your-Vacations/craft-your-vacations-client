import { NextResponse, NextRequest } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { DestinationDetail } from "@/app/types/api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const result = await bffFetch<DestinationDetail>(`/api/Destinations/${id}`, {
    isPublic: true,
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
