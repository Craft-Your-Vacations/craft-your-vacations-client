import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { bffFetch } from "@/lib/bff";
import type { UserDocument } from "@/app/types/api";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5025";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> },
) {
  const { type } = await params;

  // auth() is memoized per-request in v5 — calling it here and inside bffFetch
  // both return the same fresh session without a double refresh.
  const session = await auth();

  const metaResult = await bffFetch<UserDocument[]>(
    "/api/Users/me/documents",
    { isPublic: false, cache: "no-store" },
  );

  if (!metaResult.ok) return metaResult.response;

  const doc = metaResult.data.find((d) => d.type === type);
  if (!doc) {
    return NextResponse.json(
      { message: "Document not found" },
      { status: 404 },
    );
  }

  const fileRes = await fetch(`${BACKEND_URL}${doc.fileUrl}`, {
    headers: {
      Authorization: `Bearer ${session?.backendAccessToken}`,
    },
  });

  if (!fileRes.ok) {
    return NextResponse.json(
      { message: "File unavailable" },
      { status: fileRes.status },
    );
  }

  const contentType =
    fileRes.headers.get("content-type") ?? "application/octet-stream";
  const body = await fileRes.arrayBuffer();

  return new NextResponse(body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": "inline",
    },
  });
}
