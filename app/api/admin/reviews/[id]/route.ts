import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/routeHelpers";
import { bffFetch } from "@/lib/bff";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(req);
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;

  const result = await bffFetch<void>(`/api/Reviews/${id}`, req, {
    isPublic: false,
    method: "DELETE",
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  revalidateTag("reviews", { expire: 0 });
  return new NextResponse(null, { status: 204 });
}
