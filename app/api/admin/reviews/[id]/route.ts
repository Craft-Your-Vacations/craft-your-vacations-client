import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import { auth } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const result = await bffFetch<void>(`/api/Reviews/${id}`, {
    isPublic: false,
    method: "DELETE",
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  return new NextResponse(null, { status: 204 });
}
