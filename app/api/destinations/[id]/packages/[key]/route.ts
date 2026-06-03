import { NextResponse, NextRequest } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { PackageDetail } from "@/app/types/api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; key: string }> }
): Promise<NextResponse> {
  const { id, key } = await params;
  const result = await bffFetch<PackageDetail>(
    `/api/Destinations/${id}/Packages/${key}`, { isPublic: true, cache: "no-store" }
  );
  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
