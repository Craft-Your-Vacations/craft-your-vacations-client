import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import { auth } from "@/lib/auth";
import type { PackageDetail, UpdatePackageRequest } from "@/app/types/api";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; key: string }> }
): Promise<NextResponse> {
  const session = await auth();
  if (session?.user?.role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id, key } = await params;
  const body: UpdatePackageRequest = await req.json();

  const result = await bffFetch<PackageDetail>(
    `/api/Destinations/${id}/Packages/${key}`, {
      isPublic: false,
      method: "PUT",
      cache: "no-store",
      body,
    }
  );

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; key: string }> }
): Promise<NextResponse> {
  const session = await auth();
  if (session?.user?.role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id, key } = await params;

  const result = await bffFetch<void>(
    `/api/Destinations/${id}/Packages/${key}`, {
      isPublic: false,
      method: "DELETE",
      cache: "no-store",
    }
  );

  if (!result.ok) return result.response;
  return new NextResponse(null, { status: 204 });
}
