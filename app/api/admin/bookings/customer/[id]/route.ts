import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import { auth } from "@/lib/auth";
import type { AdminBooking } from "@/app/types/api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const result = await bffFetch<AdminBooking[]>(`/api/Bookings/customer/${id}`, {
    isPublic: false,
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
