<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Coding Conventions

## Navigation
- Always use `<Link>` from `next/link` for internal navigation. Never use bare `<a>` tags for routing.
- Always use `useRouter` from `next/navigation`. Never import it from `next/router`.

## Images
- Always use `<Image>` from `next/image` instead of `<img>` tags.

## Styling
- Always use Tailwind CSS utility classes. Avoid inline styles and custom CSS unless absolutely necessary.
- Never use arbitrary CSS in `className` (e.g. `[box-shadow:...]`). Always use Tailwind's built-in utilities or token-based variants (e.g. `shadow-lg shadow-primary/20`).
- This project uses **Tailwind CSS v4**. Always use v4 utility names — never v3 names. When in doubt about a utility name, check the Tailwind v4 docs. Do not assume v3 class names still apply.
- Before introducing any new color, typography, or design token, check `global.css` first. Use existing variables — do not add new ones.
- **Status colors — always use semantic tokens, never raw Tailwind palette colors:**
  - Error / destructive: `text-error`, `bg-error/10`, `ring-error/50`, `border-error/50`, `hover:text-error`, `hover:bg-error/10`
  - Warning: `text-warning`, `bg-warning/10`, `border-warning/20`
  - Success: `text-success`, `bg-success/10`, `bg-success/15`
  - These tokens are defined in `globals.css` and automatically adapt to light/dark theme. Never use `text-red-*`, `text-amber-*`, `text-green-*`, `bg-red-*`, etc. for semantic status.

## Design System

The system name is "The Nocturnal Voyager" (tokens live in `globals.css`). Keep these rules — they exist because the component layer had drifted from the tokens.

### Corner radius — role-based, proportional (control < card < modal)
| Role | Class | Applies to |
|---|---|---|
| Solid button | `rounded-2xl` | `Button` primary / secondary / error variants |
| Input / small control | `rounded-xl` | inputs, selects, textareas, icon tiles, nav/pagination items, `Button` `ghost`/`text` |
| Card / panel | `rounded-2xl` | `Surface` (both variants), content cards (`p-5`/`p-6`), dropzones |
| Large panel | `rounded-3xl` | high-padding hero/auth panels + `EmptyState` (`p-8`+) — intentionally larger |
| Modal | `rounded-3xl` | `Dialog` panel |
| Pill / avatar | `rounded-full` | status/city chips, avatars, icon buttons, FABs |

### Spacing
- Card padding: `p-6` default, `p-5` compact; large hero/auth panels may keep `p-8`/`p-10`.
- Pill: one recipe — `rounded-full px-3 py-1 text-label-sm`.
- Page gutter: `px-6 md:px-10` (never `px-4`/`px-8`), width capped with `max-w-(--container-max-w)`.
- Dialog content gap: status/confirm dialogs `gap-5`; form dialogs `gap-6`.

### Icon glyph sizing
Size material/lucide icons with the nearest standard step — `text-sm`(14) / `text-lg`(18) / `text-xl`(20) / `text-2xl`(24), or explicit `w-*/h-*` on lucide. **Never** `text-[Npx]`. Body/label text always uses the named `text-body-*` / `text-label-*` scale — never raw `text-sm`/`text-lg` for copy.

### Reach for these shared components — do NOT re-invent their markup
| Need | Use |
|---|---|
| Any button / icon button / link-styled action | `Button` (`variant`: primary, secondary, error, ghost, icon, overlay, text) |
| Glass panel / table container | `Surface` (`variant`: default, table) |
| "No items" empty state | `EmptyState` (`title`, optional `description` / `icon` / `action`) — a standalone glass panel rendered *instead of* the list (`list.length === 0 ? <EmptyState/> : <content>`); never nest it inside a `Surface`/table |
| Text input (labeled OR compact/inline, optional leading `icon`) | `FormField` |
| Dropdown | `SelectField` · Multiline | `TextAreaField` · Checkbox | `Checkbox` |
| 6-digit OTP entry | `OtpInput` · Pill tab switcher | `SegmentedControl` |
| Brand icon badge beside a label | `IconBadge` · Bordered key/value chip | `InfoChip` |
| Any modal | `Dialog` base → a dedicated `<Name>Dialog` (never inline overlay markup) |

`FormField`/`SelectField`/`TextAreaField` take an **optional** `label` — omit it for compact/inline fields (search boxes, table-row editors) instead of hand-rolling a raw `<input>`/`<select>`.

## Mobile-first & Responsive Design
- **Always design for mobile first.** Base styles for mobile, `md:` overrides for desktop.
- Use only the `md:` breakpoint (768px) for the mobile/desktop split — no `sm:`, `lg:`, `xl:` unless clearly needed.
- Side-by-side layouts: default `flex-col` on mobile, `md:flex-row` on desktop.
- Fixed sidebars: `md:translate-x-0` to stay visible on desktop, slide-in on mobile — never a fixed `ml-*` without matching `md:ml-*`.
- Fixed top bar on mobile (e.g. `h-14`): compensate with `pt-14 md:pt-0` on main content.
- Mentally test any new page at ~375px width before finalising class names.

## Components
- Check `components/` for an existing component before creating a new one.
- New components go in `components/<Name>/<Name>.tsx` and must be reusable.
- **Never write a wall of JSX directly in a page.** Pages should be composed of named components — if a UI block has a clear identity, extract it.

### When to extract a component
Extract into its own file when the block is any of the following:

| Signal | Examples |
|--------|---------|
| **Reusable** — used or likely to be used in 2+ places | banners, document cards, upload rows |
| **Self-contained** — has its own local state, step logic, or refs | dialogs, OTP inputs, multi-step flows |
| **Independently meaningful** — has a clear name distinct from the page | `ChangePhoneDialog`, `EmailVerificationBanner` |

### When NOT to extract
- A few lines of JSX with no state and no reuse potential
- Tightly coupled to one page's specific data with no logical boundary of its own
- So simple that extracting would only move code without adding clarity

## Dialogs and Modals
- Always use `components/Dialog/Dialog.tsx` as the base. Never write overlay/backdrop/panel wrapper manually.
- **Every dialog gets its own component file** in `components/<Name>Dialog/<Name>Dialog.tsx` — never write dialog JSX inline in a page.
- Pass `onClose` when dismissible (backdrop click / Escape). Omit for non-dismissible dialogs (e.g. inactivity warning).
- `size="lg"` for form-heavy modals; default `size="sm"` for confirmation dialogs.

## Page vs Component responsibilities
- **Modals belong to the page.** The page controls `isOpen` state and renders the dialog component — never control modal open/close inside a card, list item, or child component.
- **Queries and mutations belong to the page.** Never call `useQuery` or `useMutation` inside dialog or card components — pass data and callbacks as props.
- **Components own their local UI state.** Field values, step toggles (e.g. `sent`, `otpSent`), OTP digit arrays, and input refs all live inside the component, not the page.

### Callback pattern for dialogs
Pass mutations down as `onAction(value: string, onSuccess: () => void)` — the page fires the mutation and calls `onSuccess` on completion; the dialog uses `onSuccess` to advance its own step state (e.g. `() => setSent(true)`). Never pass raw mutation functions directly.

### Close handler convention
- **Page close handler:** `setOpen(false)` + `resetMutation()` only — never reset component-internal state from the page.
- **Component:** `useEffect(() => { if (!isOpen) resetLocalState(); }, [isOpen])` — the component is responsible for cleaning up its own state when closed.

## User Feedback

### Toast notifications (`stores/useToastStore.ts`)
- Global toast system via Zustand. Import `useToastStore` and call `addToast(...)`.
- Positioned top-right below navbar. Auto-dismiss (5s default). Max 3 visible.
- Key-based deduplication: provide a `key` to prevent duplicate toasts from repeated actions.
- Always provide a `key` for mutation feedback (e.g. `"update-profile"`, `"delete-package"`).

### When to use what

| Scenario | Pattern |
|---|---|
| Routine CRUD success (save, update, delete) | Success toast (auto-dismiss) |
| Routine CRUD error | Error toast (auto-dismiss) |
| Significant milestone success (booking created, review submitted) | `ModalSuccess` dialog |
| Significant milestone error (booking/review creation failure) | `ModalError` dialog with "Try Again" |
| Form validation in active dialogs | Inline error in dialog (unchanged) |
| Auth page errors (login) | Toast |
| Auth page errors (register, reset, onboarding) | Inline error |

**Never** show inline success/error text next to buttons for mutation results — always use toast.
**Button loading:** Use the `loading` prop on `Button` — shows spinner, hides children, auto-disables. Never change button text to "Saving…" etc.

---

# Project Architecture

## Stack
- **Next.js 16.2.2** — App Router. Middleware file is `proxy.ts` (not `middleware.ts`), exported function is `proxy` (not `middleware`).
- **React 19**, **TypeScript**, **Tailwind CSS v4**
- **NextAuth** (`next-auth` v4) — Credentials + Google OAuth providers
- **TanStack React Query v5** for server state
- **Zustand v5** for client UI state
- **Axios** for browser-side HTTP (`lib/api.ts`)
- **Native fetch** (Next.js extended) for server-side HTTP (`lib/bff.ts`)

---

## Data Fetching Architecture

Two separate HTTP layers — **never mix them.**

```
Browser
  ↓ lib/api.ts (axios, baseURL=/api)
Next.js API Route (app/api/...)
  ↓ lib/bff.ts (native fetch, hits .NET at localhost:5025)
.NET Backend
```

### Layer 1 — Browser → Next.js: `lib/api.ts`
- Used inside React components and hooks
- `api.get<T>()`, `api.post<T>()`, `api.put<T>()`, `api.patch<T>()`, `api.delete<T>()`
- Returns response body directly as `T`
- On error, rejects with a readable `Error` extracted from the response body

### Layer 2 — Next.js → .NET: `lib/bff.ts`
- Used only inside route handlers (`app/api/**/route.ts`) — never from components
- `isPublic: true` — skips auth check
- `isPublic: false` (default) — calls `getServerSession(authOptions)` first, triggering the `jwt` callback which transparently refreshes the backend token if near expiry. Returns 401 if no valid session. Attaches `Authorization: Bearer <token>` automatically.
- **Never replace `getServerSession` with `getToken` in `bffFetch`** — `getToken` bypasses the jwt callback and the token will never be refreshed inline.
- `cache` defaults to `{ revalidate: 300 }` (5-min ISR). Override:
  - `{ revalidate: N }` — cache N seconds
  - `"no-store"` — always fresh (user-specific data)
  - `"force-cache"` — indefinite (static reference data)

### `lib/endpoints.ts`
All API call functions live here, grouped by domain. Always add new functions here — never inline `api.get(...)` in hooks or components.

### `lib/queryKeys.ts`
All TanStack Query keys live here. Use function-based keys for dynamic values. Always namespace by domain so `invalidateQueries` can target the whole domain.

### `hooks/`
Every `useQuery`/`useMutation` call lives in a dedicated hook file. Hooks import from `lib/endpoints.ts` and `lib/queryKeys.ts` — never construct URLs or keys inline.

### Mutations pattern
- `mutate(payload, { onSuccess, onError })` — never `mutateAsync` + try/catch
- Error is `mutation.error` — no separate error `useState` for mutation errors
- Invalidate relevant query keys after successful mutations

---

## Adding a New API Endpoint — Checklist

1. **`app/api/<resource>/route.ts`** — route handler, call `bffFetch` with `isPublic` and `cache`
2. **`lib/endpoints.ts`** — client-side API function
3. **`lib/queryKeys.ts`** — query key(s)
4. **`hooks/use<Resource>.ts`** — React Query hook
5. **Component** — consume the hook

---

## State Management

| Data | Where it lives |
|------|---------------|
| Anything from .NET backend | TanStack React Query |
| Auth session / user profile | NextAuth (`useSession()`) |
| Theme (dark/light) | `next-themes` (`useTheme()`) |
| UI state shared across 2+ components | Zustand store (`stores/`) |
| UI state local to one component | `useState` |

**Never duplicate API data into Zustand or `useState`.**

Zustand — one store per concern, not per screen. Keep stores minimal: state + actions only. Current store: `stores/useUIStore.ts` (mobile menu).

---

## Authentication

- NextAuth config: `lib/auth.ts` — providers, JWT callbacks, refresh deduplication, sign-out revocation
- Client session: `useSession()` from `next-auth/react`
- `proxy.ts` is a passthrough — no redirect logic lives there

### Token flow
The .NET backend owns authentication. On login it returns `accessToken`, `refreshToken`, `accessTokenExpiry`. NextAuth stores these in its encrypted session cookie — it does **not** issue its own tokens.

- `token.userId` is stored separately in the NextAuth JWT (not inside the .NET access token) and exposed as `session.user.userId`
- `session.user.phoneVerified` — controls onboarding redirect
- `session.user.role` — set by the backend on login; **cannot be overridden by client-side `update()` calls** (the `jwt` callback strips `role` from client-provided session updates)
- Auto-refresh: `jwt` callback calls `POST /api/Auth/refresh` when the token is within 60 seconds of expiry. On failure: `token.error = "RefreshAccessTokenError"`
- When `session?.error === "RefreshAccessTokenError"`, the refresh token is invalid — force sign-out. Guards check for this and redirect to `/login`
- **`backendAccessToken` is server-only** — used inside `bffFetch` to attach the `Authorization` header. Never exposed to the browser
- **Never replace `getServerSession` with `getToken` in `bffFetch`** — the jwt callback (and inline refresh) only fires via `getServerSession`

### Concurrent refresh deduplication
`lib/auth.ts` holds a module-level `pendingRefreshes: Map<string, Promise<JWT>>`. If multiple parallel requests trigger a refresh for the same user, only one actual `/refresh` call is made — the rest wait on the same promise. This prevents token rotation failures from concurrent 401s.

### Session updates
After OTP verification, call `update({ phoneVerified: true })` to update the session without a full re-login. The `jwt` callback applies it to the token. Do not pass `role` in updates — it is silently stripped.

### Sign-out
`events.signOut` in `lib/auth.ts` calls `POST /api/Auth/logout` with the refresh token to revoke it server-side before NextAuth clears the session.

### Rate limiting
Lives on the **.NET backend**. The BFF forwards client IP via `X-Forwarded-For` / `X-Real-IP` headers (set automatically in `lib/bff.ts` and `lib/auth.ts`). See `docs/rate-limiting.md` for the full endpoint table and limits.

### Inactivity logout
`hooks/useInactivityLogout.ts`, consumed in `RootGuard`:
- 15 minutes idle → `InactivityDialog` with 30-second countdown
- Activity events reset the timer; once the dialog shows, only "Keep Signed In" dismisses it
- On expiry or sign-out: `signOut({ redirect: false })` then `window.location.replace("/login")` — `replace` prevents Back button returning to protected page

### Route guards
Auth redirect logic lives in **client-side layouts**, not `proxy.ts`:
- `app/(root)/layout.tsx` — protects main app; redirects unverified users to `/onboarding`; forces sign-out on `RefreshAccessTokenError`
- `app/(auth)/layout.tsx` — redirects verified users away from `/login`, `/register`; redirects unauthenticated from `/onboarding`
- Guards return `null` while session loads or redirect is imminent (prevents flash of protected content)

---

## File Structure Reference

```
app/
  (auth)/           — Auth pages (login, register, reset-password, onboarding)
  (root)/           — Main app pages (with Navbar)
  api/              — Next.js route handlers (BFF entry points)
components/         — Reusable UI components
hooks/              — React Query hooks (one per resource)
lib/
  api.ts            — Axios client (browser → Next.js)
  bff.ts            — BFF fetcher (Next.js → .NET)
  auth.ts           — NextAuth config (providers, JWT callbacks, refresh, sign-out)

  endpoints.ts      — All API call functions grouped by domain
  queryKeys.ts      — TanStack Query key factory
  utils.ts          — Shared utilities (cn, etc.)
stores/             — Zustand stores (one per concern)
docs/
  rate-limiting.md  — Rate limit endpoints, keys, limits (enforced by .NET backend)
proxy.ts            — Next.js middleware (passthrough; required by framework)
```

## Keeping Docs in Sync

After any code change, update **only** the affected doc — keep edits minimal:

| What changed | Update |
|---|---|
| New/modified rate limit endpoint, key, or limit | `docs/rate-limiting.md` — relevant table row only |
| New hook, endpoint function, or query key | No doc update needed — code is the source of truth |
| New reusable component or lib file added | No doc update needed unless it introduces a new pattern or convention |
| New architectural pattern or coding rule | `AGENTS.md` — add to the relevant section only |

Do not rewrite entire sections. Add or edit only the lines that changed.
