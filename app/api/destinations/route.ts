import { NextResponse, NextRequest } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { Destination } from "@/app/types/api";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const result = await bffFetch<Destination[]>("/api/Destinations", {
    isPublic: true,
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
