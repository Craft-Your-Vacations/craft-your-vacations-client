import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/routeHelpers";
import { bffFetch } from "@/lib/bff";
import type { AdminReview } from "@/app/types/api";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(req);
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;

  const result = await bffFetch<AdminReview>(`/api/Reviews/${id}/approve`, req, {
    isPublic: false,
    method: "POST",
    cache: "no-store",
    body: {},
  });

  if (!result.ok) return result.response;
  revalidateTag("reviews", { expire: 0 });
  return NextResponse.json(result.data);
}
