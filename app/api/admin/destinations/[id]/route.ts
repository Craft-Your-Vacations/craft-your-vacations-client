import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import { auth } from "@/lib/auth";
import type { DestinationDetail, CreateDestinationRequest } from "@/app/types/api";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const session = await auth();
  if (session?.user?.role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body: Partial<CreateDestinationRequest> = await req.json();

  const result = await bffFetch<DestinationDetail>(`/api/Destinations/${id}`, {
    isPublic: false,
    method: "PATCH",
    cache: "no-store",
    body,
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const session = await auth();
  if (session?.user?.role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const result = await bffFetch<void>(`/api/Destinations/${id}`, {
    isPublic: false,
    method: "DELETE",
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  return new NextResponse(null, { status: 204 });
}
