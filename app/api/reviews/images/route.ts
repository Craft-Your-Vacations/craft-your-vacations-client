import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5025";

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path");

  if (!path || !path.startsWith("/")) {
    return NextResponse.json({ message: "Invalid path" }, { status: 400 });
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });

  const headers: Record<string, string> = {};
  if (token?.backendAccessToken) {
    headers["Authorization"] = `Bearer ${token.backendAccessToken}`;
  }

  let fileRes: Response;
  try {
    fileRes = await fetch(`${BACKEND_URL}${path}`, { headers });
  } catch {
    return NextResponse.json({ message: "Service unavailable" }, { status: 503 });
  }

  if (!fileRes.ok) {
    return NextResponse.json({ message: "Image unavailable" }, { status: fileRes.status });
  }

  const contentType = fileRes.headers.get("content-type") ?? "image/jpeg";

  return new NextResponse(fileRes.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
