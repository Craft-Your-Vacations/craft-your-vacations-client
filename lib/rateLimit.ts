import { NextRequest, NextResponse } from "next/server";

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

// Extracts the real client IP from standard proxy headers.
// x-forwarded-for is set by load balancers and proxies (Vercel, nginx, Cloudflare).
// Falls back to x-real-ip (nginx), then req.ip (Vercel edge), then "unknown".
export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    req.ip ??
    "unknown"
  );
}

// Returns true if this key has exceeded the limit for the current window.
// Keys are namespaced per endpoint (e.g. "login:1.2.3.4") so each route
// has its own independent counter per IP.
export function isRateLimited(
  key: string,
  limit = 10,
  windowMs = 60_000,
): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count++;
  return entry.count > limit;
}

// Standard 429 response — consistent shape with all other API errors.
export function rateLimitResponse(): NextResponse {
  return NextResponse.json(
    { message: "Too many requests. Please try again in a minute." },
    { status: 429, headers: { "Retry-After": "60" } },
  );
}
