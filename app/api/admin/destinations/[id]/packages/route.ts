import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/routeHelpers";
import { bffFetch } from "@/lib/bff";
import type { PackageDetail, CreatePackageRequest } from "@/app/types/api";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const guard = await requireAdmin(req);
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const body: CreatePackageRequest = await req.json();

  const result = await bffFetch<PackageDetail>(
    `/api/destinations/${id}/packages`,
    req,
    {
      isPublic: false,
      method: "POST",
      cache: "no-store",
      body,
    }
  );

  if (!result.ok) return result.response;
  revalidateTag("packages", { expire: 0 });
  revalidateTag("destinations", { expire: 0 });
  return NextResponse.json(result.data, { status: 201 });
}
