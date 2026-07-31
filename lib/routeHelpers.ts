import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { decodeClaims } from "@/lib/supabase/claims";

export function apiError(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

// Admin gate for Next.js admin API routes (defense-in-depth — .NET also enforces
// [Authorize(Roles="Admin")]). Checks the Supabase session + the user_role claim.
export async function requireAdmin(
  _req: NextRequest,
): Promise<{ userId: string } | NextResponse> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return apiError("Unauthorized", 401);
  if (decodeClaims(session.access_token).user_role !== "Admin")
    return apiError("Forbidden", 403);

  return { userId: session.user.id };
}
