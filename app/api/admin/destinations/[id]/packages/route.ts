import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import { auth } from "@/lib/auth";
import type { PackageDetail, CreatePackageRequest } from "@/app/types/api";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const session = await auth();
  if (session?.user?.role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body: CreatePackageRequest = await req.json();

  const result = await bffFetch<PackageDetail>(
    `/api/Destinations/${id}/Packages`, {
      isPublic: false,
      method: "POST",
      cache: "no-store",
      body,
    }
  );

  if (!result.ok) return result.response;
  return NextResponse.json(result.data, { status: 201 });
}
