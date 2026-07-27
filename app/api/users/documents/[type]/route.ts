import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { UserDocument } from "@/app/types/api";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const formData = await req.formData();

  const result = await bffFetch<UserDocument>(
    `/api/users/me/documents/${type}`,
    req,
    {
      isPublic: false,
      method: "PUT",
      cache: "no-store",
      rawBody: formData,
    }
  );

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
