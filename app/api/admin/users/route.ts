import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/routeHelpers";
import { bffFetch } from "@/lib/bff";
import type { Customer, PaginatedResponse } from "@/app/types/api";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard instanceof NextResponse) return guard;

  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");
  const search = searchParams.get("search");

  const query = new URLSearchParams();
  if (page) query.set("page", page);
  if (pageSize) query.set("pageSize", pageSize);
  if (search) query.set("search", search);
  const qs = query.toString() ? `?${query.toString()}` : "";

  const result = await bffFetch<PaginatedResponse<Customer>>(`/api/users/all${qs}`, req, {
    isPublic: false,
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
