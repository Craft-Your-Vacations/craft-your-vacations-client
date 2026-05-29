# Rate Limiting

Rate limiting lives on the **Next.js API route layer**, not on .NET. All requests to .NET come from the Next.js server's single IP — IP-based limiting there would bucket all users into one counter.

## `lib/rateLimit.ts` exports

- `getClientIp(req)` — extracts real client IP: `x-forwarded-for` → `x-real-ip` → `req.ip` → `"unknown"`
- `isRateLimited(key, limit = 10, windowMs = 60_000)` — in-memory fixed-window counter; returns `true` if over limit
- `rateLimitResponse()` — `429 JSON { message: "Too many requests..." }` with `Retry-After: 60` header

The store is a module-level `Map<string, { count, resetAt }>`. Expired entries are overwritten on next access — no background cleanup needed.

## Protected endpoints

| Endpoint | File | Key format | Limit |
|----------|------|-----------|-------|
| Login (credentials) | `app/api/auth/[...nextauth]/route.ts` | `login:<ip>` | 10/min |
| Register | `app/api/auth/register/route.ts` | `register:<ip>` | 5/min |
| Start password reset | `app/api/auth/start-reset/route.ts` | `start-reset:<ip>` | 5/min |
| Reset password | `app/api/auth/reset-password/route.ts` | `reset-password:<ip>` | 5/min |
| Send OTP | `app/api/phone/send-otp/route.ts` | `send-otp:<ip>` | 5/min |
| Token refresh | `lib/auth.ts` (jwt callback) | `refresh:<userId>` | 10/min |

Refresh uses `userId` (not IP) because it runs server-to-server inside the `jwt` callback — there is no request object with a client IP available there.

## Login — special handling

Login goes through NextAuth's `[...nextauth]` catch-all route. The POST handler in that file intercepts only `/api/auth/callback/credentials` — all other NextAuth paths (session, csrf, signout) pass through untouched.

When rate limited, the response must be **NextAuth-compatible JSON** (not a plain 429) because NextAuth's client does `new URL(data.url)` on the response — passing a plain `{ message }` body causes `TypeError: Failed to construct 'URL': Invalid URL`.

The correct response:
```ts
return NextResponse.json(
  { url: `${req.nextUrl.origin}/login?error=TooManyRequests` },
  { status: 429 },
);
```

NextAuth extracts `error` from the URL search params and returns `result.error = "TooManyRequests"` to the `signIn()` caller. The login page maps this to a human-readable message:
```ts
if (result?.error === "TooManyRequests") {
  setError("Too many requests. Please try again in a minute.");
}
```

The login page also handles `?error=TooManyRequests` in the URL search params (shown via `useState` initializer) in case NextAuth redirects the browser directly.

## UI handling for other endpoints

For all non-NextAuth endpoints, the axios interceptor in `lib/api.ts` extracts `error.response?.data?.message` from the 429 response body. This means `mutation.error.message` will be `"Too many requests. Please try again in a minute."` automatically — no special handling needed beyond rendering `error.message` in the UI (which all auth forms already do).
