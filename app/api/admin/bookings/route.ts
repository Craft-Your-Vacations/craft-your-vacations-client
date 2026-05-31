import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { bffFetch } from "@/lib/bff";
import type { AdminBooking, PaginatedResponse } from "@/app/types/api";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
  if (token?.role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");

  const query = new URLSearchParams();
  if (status) query.set("status", status);
  if (page) query.set("page", page);
  if (pageSize) query.set("pageSize", pageSize);
  const qs = query.toString() ? `?${query.toString()}` : "";

  const result = await bffFetch<PaginatedResponse<AdminBooking>>(`/api/Bookings/all${qs}`, req, {
    isPublic: false,
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
