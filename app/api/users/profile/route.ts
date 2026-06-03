import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { User } from "@/app/types/api";

export async function GET(req: NextRequest) {
  const result = await bffFetch<User>("/api/Users/profile", {
    isPublic: false,
    method: "GET",
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();

  const result = await bffFetch<User>("/api/Users/profile", {
    isPublic: false,
    method: "PATCH",
    body: {
      Name: body.name,
      DateOfBirth: body.dateOfBirth,
      Nationality: body.nationality,
      CountryOfResidence: body.countryOfResidence,
      Profession: body.profession,
    },
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
