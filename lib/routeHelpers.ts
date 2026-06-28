import { NextRequest, NextResponse } from "next/server";
import { getToken, JWT } from "next-auth/jwt";

export function apiError(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

export async function requireAdmin(req: NextRequest): Promise<JWT | NextResponse> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
  if (!token) return apiError("Unauthorized", 401);
  if (token.role !== "Admin") return apiError("Forbidden", 403);
  return token;
}
