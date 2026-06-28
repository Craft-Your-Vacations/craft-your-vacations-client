import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/routeHelpers";
import { bffFetch } from "@/lib/bff";
import type { AdminBooking, AdminUpdateBookingRequest } from "@/app/types/api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin(req);
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;

  const result = await bffFetch<AdminBooking>(
    `/api/Bookings/${id}/admin`,
    req,
    {
      isPublic: false,
      method: "GET",
      cache: "no-store",
    },
  );

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin(req);
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const body: AdminUpdateBookingRequest = await req.json();

  const result = await bffFetch<AdminBooking>(
    `/api/Bookings/${id}/admin`,
    req,
    {
      isPublic: false,
      method: "PATCH",
      cache: "no-store",
      body,
    },
  );

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
