import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { User } from "@/app/types/api";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = await bffFetch<User>("/api/Auth/register", req, {
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
