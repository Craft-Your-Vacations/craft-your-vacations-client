import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5025";

interface BffFetchOptions {
  /** If true, skips the auth check. Use for public endpoints. */
  isPublic?: boolean;
  /** Next.js cache strategy. Defaults to revalidate every 300s. */
  cache?: RequestCache | { revalidate: number; tags?: string[] };
  /** Extra headers to forward to .NET */
  headers?: Record<string, string>;
  /** HTTP method. Defaults to GET. */
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Request body — will be JSON-serialised. */
  body?: unknown;
  /**
   * Raw body (e.g. FormData for file uploads). When set, Content-Type is NOT
   * forced to application/json and the body is forwarded as-is so the fetch
   * API can set the correct multipart boundary automatically.
   */
  rawBody?: FormData | Blob;
}

type BffResult<T> =
  | { ok: true; data: T }
  | { ok: false; response: NextResponse };

export async function bffFetch<T>(
  path: string,
  req: NextRequest,
  options: BffFetchOptions = {},
): Promise<BffResult<T>> {
  const {
    isPublic = false,
    cache = { revalidate: 300 },
    headers = {},
    method = "GET",
    body,
    rawBody,
  } = options;

  // 1. Auth check — read the Supabase session (the proxy middleware keeps the
  // access token fresh). The .NET backend re-validates the JWT via JWKS.
  let accessToken: string | undefined;
  if (!isPublic) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      return {
        ok: false,
        response: NextResponse.json(
          { message: "Unauthorized" },
          { status: 401 },
        ),
      };
    }
    accessToken = session.access_token;
  }

  // 2. Build headers
  // rawBody (e.g. FormData) must not have Content-Type set manually — the
  // fetch API derives the correct multipart boundary automatically.
  const fetchHeaders: Record<string, string> = rawBody
    ? { ...headers }
    : { "Content-Type": "application/json", ...headers };

  if (accessToken) {
    fetchHeaders["Authorization"] = `Bearer ${accessToken}`;
  }

  // Forward client IP so .NET can rate-limit by real client IP, not the BFF's IP.
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) fetchHeaders["X-Forwarded-For"] = forwardedFor;
  const realIp = req.headers.get("x-real-ip");
  if (realIp) fetchHeaders["X-Real-IP"] = realIp;

  // 3. Build fetch options (supports both Next.js revalidate and standard cache)
  const cacheConfig =
    typeof cache === "object" && "revalidate" in cache
      ? { next: cache as { revalidate: number; tags?: string[] } }
      : { cache: cache as RequestCache };

  const fetchOptions: RequestInit = {
    method,
    headers: fetchHeaders,
    ...cacheConfig,
    ...(rawBody !== undefined
      ? { body: rawBody }
      : body !== undefined
        ? { body: JSON.stringify(body) }
        : {}),
  };

  // 4. Call .NET backend
  let backendResponse: Response;

  try {
    backendResponse = await fetch(`${BACKEND_URL}${path}`, fetchOptions);
  } catch (e) {
    console.log(`BFF fetch failed ${path} ${e}`);
    return {
      ok: false,
      response: NextResponse.json(
        { message: "Service unavailable. Please try again later." },
        { status: 503 },
      ),
    };
  }

  // 5. Handle .NET errors
  if (!backendResponse.ok) {
    let message = `Request to ${path} failed`;
    try {
      const body = (await backendResponse.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // non-JSON or empty body — use HTTP status text if available
      if (backendResponse.statusText) message = backendResponse.statusText;
    }
    return {
      ok: false,
      response: NextResponse.json(
        { message },
        { status: backendResponse.status },
      ),
    };
  }

  // 6. Parse and return (204 No Content or empty body → return undefined as T)
  const contentLength = backendResponse.headers.get("content-length");
  if (backendResponse.status === 204 || contentLength === "0") {
    return { ok: true, data: undefined as T };
  }
  const data = (await backendResponse.json()) as T;
  return { ok: true, data };
}
