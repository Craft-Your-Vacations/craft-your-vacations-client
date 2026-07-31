import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Next.js 16 middleware (this framework version names the file `proxy.ts` and the
// export `proxy`, not `middleware`). Refreshes the Supabase auth session on every
// request so Server Components and the BFF always see a valid access token.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          if (headers) {
            Object.entries(headers).forEach(([key, value]) =>
              response.headers.set(key, value as string),
            );
          }
        },
      },
    },
  );

  // IMPORTANT: getClaims() triggers the token refresh + Set-Cookie when near expiry.
  // With asymmetric (ES256) signing keys it verifies the JWT locally against the JWKS
  // — no per-request network call to Supabase (unlike getUser()). Do not run any code
  // between createServerClient and this call, or sessions can be dropped.
  await supabase.auth.getClaims();

  return response;
}

export const config = {
  // Run on all paths except static assets.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
