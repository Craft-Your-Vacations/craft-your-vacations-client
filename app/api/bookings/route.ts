import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { Booking, CreateBookingRequest } from "@/app/types/api";

export async function GET(req: NextRequest) {
  const result = await bffFetch<Booking[]>("/api/Bookings/my", req, {
    isPublic: false,
    method: "GET",
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}

export async function POST(req: NextRequest) {
  const body: CreateBookingRequest = await req.json();

  const result = await bffFetch<Booking>("/api/Bookings", req, {
    isPublic: false,
    method: "POST",
    cache: "no-store",
    body: {
      PackageId: body.packageId,
      TravelersCount: body.travelersCount,
      PreferredMonth: body.preferredMonth,
      Notes: body.notes,
    },
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data, { status: 201 });
}
