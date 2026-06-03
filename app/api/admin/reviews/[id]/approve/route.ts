import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import { auth } from "@/lib/auth";
import type { AdminReview } from "@/app/types/api";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const result = await bffFetch<AdminReview>(`/api/Reviews/${id}/approve`, {
    isPublic: false,
    method: "POST",
    cache: "no-store",
    body: {},
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
