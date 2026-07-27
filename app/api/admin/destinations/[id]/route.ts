import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/routeHelpers";
import { bffFetch } from "@/lib/bff";
import type { DestinationDetail, CreateDestinationRequest } from "@/app/types/api";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const guard = await requireAdmin(req);
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const body: Partial<CreateDestinationRequest> = await req.json();

  const result = await bffFetch<DestinationDetail>(`/api/destinations/${id}`, req, {
    isPublic: false,
    method: "PATCH",
    cache: "no-store",
    body,
  });

  if (!result.ok) return result.response;
  revalidateTag("destinations", { expire: 0 });
  return NextResponse.json(result.data);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const guard = await requireAdmin(req);
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;

  const result = await bffFetch<void>(`/api/destinations/${id}`, req, {
    isPublic: false,
    method: "DELETE",
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  revalidateTag("destinations", { expire: 0 });
  return new NextResponse(null, { status: 204 });
}
