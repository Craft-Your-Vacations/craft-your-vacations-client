# Rate Limiting

Rate limiting lives on the **.NET backend**, not the BFF. The BFF forwards the real client IP via `X-Forwarded-For` and `X-Real-IP` headers so .NET can rate-limit per-client.

## How client IP reaches .NET

`lib/bff.ts` automatically forwards `X-Forwarded-For` and `X-Real-IP` from the incoming browser request to every .NET call. For login specifically, `lib/auth.ts` forwards `X-Forwarded-For` from the NextAuth request context to `/api/Auth/login`.

.NET must configure `ForwardedHeaders` middleware to trust these headers from the BFF's IP and extract the real client IP.

## Protected endpoints

### Tier 1 — Auth (unauthenticated, strictest)

| .NET Endpoint | Limit | Key | Rationale |
|---|---|---|---|
| `POST /api/Auth/login` | 10/min | IP | Credential stuffing |
| `POST /api/Auth/register` | 5/min | IP | Mass account creation |
| `POST /api/Auth/google-signin` | 10/min | IP | OAuth abuse guard |

### Tier 2 — OTP / Email (triggers external services)

| .NET Endpoint | Limit | Key | Rationale |
|---|---|---|---|
| `POST /api/Auth/send-otp` | 5/min | IP | SMS bombing |
| `POST /api/Auth/verify-otp` | 10/min | IP | OTP brute-force |
| `POST /api/Auth/start-reset` | 5/min | IP | SMS/email bombing |
| `POST /api/Auth/reset-password` | 5/min | IP | OTP brute-force on reset |
| `POST /api/Auth/send-email-verification` | 3/min | IP | Email spam |
| `POST /api/Auth/send-change-email` | 3/min | IP | Email spam |

### Tier 3 — Token operations (lenient)

| .NET Endpoint | Limit | Key | Rationale |
|---|---|---|---|
| `POST /api/Auth/verify-email-token` | 10/min | IP | Token scanning guard |
| `POST /api/Auth/verify-change-email-token` | 10/min | IP | Token scanning guard |
| `POST /api/Auth/refresh` | 10/min | UserId | Refresh loop prevention |

### Tier 4 — Authenticated CRUD

| .NET Endpoint | Limit | Key | Rationale |
|---|---|---|---|
| `POST /api/Bookings` | 10/min | UserId | Booking spam |
| `POST /api/Reviews` | 5/min | UserId | Review spam |
| `PUT /api/Users/profile` | 10/min | UserId | Update spam |

### Not rate limited

Read endpoints (`GET /api/Destinations`, `GET /api/Bookings/my`, etc.) and admin endpoints — naturally bounded by auth and low traffic.

## UI handling

When .NET returns 429, the response body is `{ message: "Too many requests. Please try again in a minute." }`. The axios interceptor in `lib/api.ts` extracts `error.response?.data?.message`, so `mutation.error.message` contains the rate limit message automatically.

For login, the 429 flows through the `authorize()` callback → thrown as an error → `result.error` contains the message → login page shows it via toast.
