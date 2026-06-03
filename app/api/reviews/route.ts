import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { Review, CreateReviewRequest } from "@/app/types/api";

export async function POST(req: NextRequest) {
  const body: CreateReviewRequest = await req.json();

  const result = await bffFetch<Review>("/api/Reviews", {
    isPublic: false,
    method: "POST",
    cache: "no-store",
    body: {
      BookingId: body.bookingId,
      Rating: body.rating,
      Quote: body.quote,
    },
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data, { status: 201 });
}
