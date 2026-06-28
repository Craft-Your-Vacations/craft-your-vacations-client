import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/routeHelpers";
import { bffFetch } from "@/lib/bff";
import type { Destination, CreateDestinationRequest } from "@/app/types/api";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const guard = await requireAdmin(req);
  if (guard instanceof NextResponse) return guard;

  const body: CreateDestinationRequest = await req.json();

  const result = await bffFetch<Destination>("/api/Destinations", req, {
    isPublic: false,
    method: "POST",
    cache: "no-store",
    body,
  });

  if (!result.ok) return result.response;
  revalidateTag("destinations", { expire: 0 });
  return NextResponse.json(result.data, { status: 201 });
}
