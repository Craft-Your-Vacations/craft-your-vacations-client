import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/routeHelpers";
import { bffFetch } from "@/lib/bff";
import type { PackageDetail, UpdatePackageRequest } from "@/app/types/api";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; key: string }> }
): Promise<NextResponse> {
  const guard = await requireAdmin(req);
  if (guard instanceof NextResponse) return guard;

  const { id, key } = await params;
  const body: UpdatePackageRequest = await req.json();

  const result = await bffFetch<PackageDetail>(
    `/api/destinations/${id}/packages/${key}`,
    req,
    {
      isPublic: false,
      method: "PUT",
      cache: "no-store",
      body,
    }
  );

  if (!result.ok) return result.response;
  revalidateTag("packages", { expire: 0 });
  revalidateTag("destinations", { expire: 0 });
  return NextResponse.json(result.data);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; key: string }> }
): Promise<NextResponse> {
  const guard = await requireAdmin(req);
  if (guard instanceof NextResponse) return guard;

  const { id, key } = await params;

  const result = await bffFetch<void>(
    `/api/destinations/${id}/packages/${key}`,
    req,
    {
      isPublic: false,
      method: "DELETE",
      cache: "no-store",
    }
  );

  if (!result.ok) return result.response;
  revalidateTag("packages", { expire: 0 });
  revalidateTag("destinations", { expire: 0 });
  return new NextResponse(null, { status: 204 });
}
