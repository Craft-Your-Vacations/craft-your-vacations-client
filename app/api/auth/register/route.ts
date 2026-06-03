import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { User } from "@/app/types/api";
import { getClientIp, isRateLimited, rateLimitResponse } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  if (isRateLimited(`register:${getClientIp(req)}`, 5)) return rateLimitResponse();
  const body = await req.json();

  const result = await bffFetch<User>("/api/Auth/register", {
    isPublic: true,
    method: "POST",
    body: {
      FirstName: body.firstName,
      LastName: body.lastName,
      Email: body.email,
      Password: body.password,
      MobileNumber: body.mobileNumber ?? "",
    },
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
