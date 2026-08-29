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

The system name is "The Nocturnal Voyager" (tokens live in `globals.css`; the written spec is `DESIGN.md` + `.impeccable/design.json`). Keep these rules — they exist because the component layer had drifted from the tokens.

### First principle — reuse, extend, never reinvent (READ BEFORE BUILDING UI)

This is the rule the whole design system depends on. Follow it in order:

1. **Use the existing shared component.** Before writing any UI, check `components/` (and the table below) for something that already does the job. There is almost always one — use it. Never hand-roll markup that a shared component already provides (a styled `<button>`/`<span>` instead of `Button`, a raw `<input>` instead of `FormField`, custom overlay instead of `Dialog`, an inline pill instead of `Chip`, etc.).
2. **If the design genuinely needs something the component can't do, extend the component** — add a `variant` / prop and restructure the primitive so the new need is served *from the one source of truth*. Then consume it. Do **not** fork a bespoke copy in the consuming file. A "we can't use `Button` here because X" situation is a signal to make `Button` support X.
3. **Only change the shared component when the change is genuinely needed** — prefer an existing variant first; add a new one only when none fits. Reverting a needless variant is better than shipping it.
4. **When the same block appears in 2+ places, extract it** into `components/<Name>/<Name>.tsx` (or a `lib/` helper for pure logic) and replace every copy. Duplication is drift waiting to happen.

Exceptions that are *not* violations: a CTA inside a whole-card `<Link>` uses `Button render="span"` (an interactive element inside an `<a>` is invalid HTML); `<input type="file">` behind a styled `<label>`; and genuinely bespoke widgets (e.g. the interactive star-rating picker in `ReviewModal`). Don't force dissimilar blocks into one rigid component — extract only what is actually the same.

Everything below (radius, spacing, shadow, color, icons) is the token layer this principle rests on: reuse the component; when you must touch styling, use the tokens, never raw values.

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
| Location / meta pill (city, tag, "needs attention") with optional leading icon | `Chip` (`variant`: onImage for pills over photography, onSurface for pills on cards, warning for outstanding-action pills) |
| Author / reviewer avatar (photo, else initials) | `Avatar` (`variant`: onImage, onSurface) |
| Read-only star rating row | `StarRating` (interactive picking stays bespoke in `ReviewModal`) |
| `icon + label + value` stat (booking/package summaries) | `Stat` |
| Booking-status pill | `BookingStatusBadge` (labels + colors from `lib/constants`; admin + customer) |
| "Paperwork still outstanding" pill | `PendingDocumentsChip` (`booking`, `uploadedDocumentTypes`) — owns the confirmed-only rule and the singular/plural wording; renders nothing when there is nothing pending |
| Multi-step progress dots (auth flows) | `ProgressDots` (`steps`, `current`) |
| Confirm / status / success / error modal | `ConfirmDialog` · `ModalSuccess` · `ModalError` |
| Any modal | `Dialog` base → a dedicated `<Name>Dialog` (never inline overlay markup) |
| Customer-feedback section (home, destination detail) | `TravellerVoices` (`reviews`, `id`, `eyebrow`, `title`, `titleAccent`, `description`, optional `image`) — copy + one `ReviewCard` at a time on the left, a `PhotoMosaic` on the right. Returns null with no reviews, so callers skip the guard. Each page adds a thin `<Name>Section` adapter supplying its own wording |
| Review photographs as a sliding strip | `TravellerMemories` (`reviews`, `id`, `title`, `description`) — flattens every review's `imagePaths` into landscape cards with a hover caption; owns its own responsive slot count. Renders nothing when no review has a photo. Home page passes all approved reviews, a destination page passes its own |
| Destinations as alternating landscape cards down the page | `DestinationsShowcase` (`destinations`, `numbered`) — portrait cards below lg, landscape cards alternating sides above it, each paired with a `RouteWaypoint` meta column. Shared by the destinations index and the "explore more" strip on a destination page |
| One photo broken into a staggered tile cluster | `PhotoMosaic` (`src`, `alt`) — percentage geometry over the `mosaic-tile` utility in globals.css; every tile carries the same photo offset so they reassemble one continuous image |
| Full-screen page hero over photography | `GlassHero` (`image`, `eyebrow`, `title`, `titleAccent`, `description`, `tags`, `stats`, `cta`, `scrollCue`) — owns the `min-h-dvh` section, the hard-edged glass panel, and the `id="hero-sentinel"` the navbar observes. Each page adds a thin `<Name>Hero` adapter that maps its data onto these props; never re-implement the panel. The home hero (`HeroSection`) is deliberately bespoke — see below |

Shared hooks: `useVisibleCount({ base, sm, lg })` returns how many slider slots fit at the current width — sliders need a number for their track maths, so keep the resize listener there rather than in each page.

Shared pure helpers (don't re-implement inline): `formatMonth` / `formatDate` (dates), `formatSlug` (slug → display name, e.g. `hong-kong` → `Hong Kong`), `DOCUMENT_LABELS` / `bookingStatusLabels` / `bookingStatusClasses` (display maps) and `emptyDay` / `emptyActivity` (itinerary factories) live in `lib/constants.ts` and `lib/itinerary.ts`. Never keep a local copy of a display map next to the component that renders it — that is how the booking detail page ended up labelling a PAN card "PAN Surface".

**The home hero is the one intentional exception.** `HeroSection` shares the glass-panel *look* with `GlassHero` but almost nothing else: a Ken Burns base image, a grain/scrim stack, the fanned `HeroDestinationCards`, a three-line staggered headline, `HeroSearch` in place of a CTA, and a highlight row in place of the stat row. Folding it into `GlassHero` would need roughly six new slots and would turn the shared hero into configuration soup — exactly the "don't force dissimilar blocks into one rigid component" case above. Leave it bespoke; if the two panels need to stay in visual lockstep, share the recipe as a `@utility` in `globals.css`, not as a prop.

`FormField`/`SelectField`/`TextAreaField` take an **optional** `label` — omit it for compact/inline fields (search boxes, table-row editors) instead of hand-rolling a raw `<input>`/`<select>`.

When you add a new shared component or lib helper, add a row here so the next contributor reuses it instead of rebuilding it.

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
- **Component:** reset its own state on the `isOpen → false` transition via **render-time reconciliation**, not an effect (a synchronous `setState` in an effect trips `react-hooks/set-state-in-effect`):
  ```tsx
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);
    if (!isOpen) resetLocalState();
  }
  ```

### Seeding editable state from fetched data
Don't mirror query data into local editable state with `useEffect(… , [entity])` (trips `react-hooks/set-state-in-effect` and can clobber edits on refetch). Seed during render, keyed on the entity id:
```tsx
const [seededId, setSeededId] = useState<number | null>(null);
if (entity && entity.id !== seededId) {
  setSeededId(entity.id);
  setFieldA(entity.a); // …seed each editable field
}
```

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
- **Supabase Auth** (`@supabase/ssr` + `@supabase/supabase-js`) — email/password + Google OAuth; session stored in cookies. .NET validates the Supabase JWT (asymmetric ES256) against Supabase's JWKS.
- **TanStack React Query v5** for server state
- **Zustand v5** for client UI state + auth snapshot (`stores/useAuthStore.ts`)
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
- `isPublic: false` (default) — reads the Supabase session via `createSupabaseServerClient()` (`lib/supabase/server.ts`); returns 401 if none; attaches the Supabase `access_token` as `Authorization: Bearer <token>`. `.NET` re-validates the JWT against Supabase's JWKS. Token refresh is handled by `proxy.ts` middleware, not here.
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
| Auth session (status / role / phoneVerified) | Zustand `stores/useAuthStore.ts` (read via selectors, e.g. `useAuthStore((s) => s.role)`) |
| Theme (dark/light) | `next-themes` (`useTheme()`) |
| UI state shared across 2+ components | Zustand store (`stores/`) |
| UI state local to one component | `useState` |

**Never duplicate API data into Zustand or `useState`.**

Zustand — one store per concern, not per screen. Keep stores minimal: state + actions only. Current stores: `stores/useUIStore.ts` (mobile menu), `stores/useAuthStore.ts` (Supabase auth snapshot, kept in sync by `hooks/useAuthListener.ts` mounted once in `Providers`).

---

## Authentication

Auth is owned by **Supabase**. `.NET` is a resource server that validates Supabase JWTs (asymmetric ES256) against Supabase's JWKS — there are no app-issued tokens.

- **Browser client:** `lib/supabase/client.ts` (`getSupabaseBrowserClient()`) — sign-in/out, session reads.
- **Server client:** `lib/supabase/server.ts` (`createSupabaseServerClient()`) — used in `bffFetch` and the OAuth callback.
- **Session refresh:** `proxy.ts` (Next 16 middleware) calls `supabase.auth.getClaims()` on every request to refresh the token cookie. `proxy.ts` does **not** redirect — session-refresh only.
- **Client auth state:** Zustand `stores/useAuthStore.ts`, kept in sync by `hooks/useAuthListener.ts` (mounted once in `Providers` via `onAuthStateChange`). Read with selectors: `useAuthStore((s) => s.role)`. Fields: `status`, `userId`, `email`, `role`, `phoneVerified`. **Never** re-introduce a React context provider for this.

### Custom JWT claims
A Supabase access-token hook (DB function `custom_access_token_hook`, in `CYV-API/.../Data/Supabase/supabase_auth_glue.sql`) injects two claims:
- `user_role` → drives `AdminGuard` (client) and `[Authorize(Roles="Admin")]` (.NET)
- `phone_verified` → drives the onboarding gate

They live in the JWT **payload**, not on `session.user` — decode them with `decodeClaims()` (`lib/supabase/claims.ts`). Claims re-mint on every refresh, so after OTP verification call `supabase.auth.refreshSession()` to pick up the updated `phone_verified` (see `onboarding` and `profile` pages).

### Sign in / up / out
- **Login:** `supabase.auth.signInWithPassword()` / `signInWithOAuth({ provider: "google", options: { redirectTo: ".../auth/callback" } })`.
- **OAuth callback:** `app/auth/callback/route.ts` exchanges the `code` for a session (PKCE).
- **Register:** `POST /api/auth/register` → `.NET` creates the Supabase user via the Admin API with email **pre-confirmed** (sign-in stays non-blocking), then the client `signInWithPassword`. A DB trigger creates the `users_master` row.
- **Sign-out:** `signOutBrowser()` (`lib/supabase/signOut.ts`) → `supabase.auth.signOut()`; callers handle the post-sign-out redirect.

### User data model
`auth.users` (Supabase) holds identity (email, password, provider). `users_master` (Postgres, PK = the Supabase `uuid`) holds profile/role/phone. Signup + identity-link + email-change triggers keep them in sync (`supabase_auth_glue.sql`). Email verification is **non-blocking** — a custom banner flow drives `users_master.email_verified` (Google sign-ins are auto-verified).

### Rate limiting
Lives on the **.NET backend**. The BFF forwards client IP via `X-Forwarded-For` / `X-Real-IP` (set in `lib/bff.ts`). See `docs/rate-limiting.md` for the full endpoint table and limits.

### Inactivity logout
`hooks/useInactivityLogout.ts`, consumed in `RootGuard` / `AdminGuard`:
- 15 minutes idle → `InactivityDialog` with 30-second countdown (configurable via `NEXT_PUBLIC_INACTIVITY_TIMEOUT_MINUTES`)
- Activity events reset the timer; once the dialog shows, only "Keep Signed In" dismisses it
- On expiry or sign-out: `signOutBrowser()` then `window.location.replace(...)` — `replace` prevents Back returning to a protected page
- (A server-side inactivity timeout is available on Supabase Pro to make this tamper-proof later.)

### Route guards
Auth redirect logic lives in **client-side guard components** (all read `useAuthStore`), not `proxy.ts`:
- `RootGuard` — protects the main app; redirects unverified users to `/onboarding`; redirects Admins to `/admin`
- `AuthGuard` — redirects logged-in users away from `/login`,`/register`; unauthenticated away from `/onboarding`
- `AdminGuard` — requires `role === "Admin"`, else redirects
- Guards return `null` while `status === "loading"` or a redirect is imminent (prevents flash of protected content). On sign-out `status` becomes `unauthenticated` and guards redirect to `/login`.

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
  bff.ts            — BFF fetcher (Next.js → .NET); attaches Supabase access token
  supabase/         — client.ts (browser), server.ts (SSR), claims.ts (decode JWT claims), signOut.ts
  endpoints.ts      — All API call functions grouped by domain
  queryKeys.ts      — TanStack Query key factory
  utils.ts          — Shared utilities (cn, etc.)
stores/             — Zustand stores (useUIStore, useAuthStore)
hooks/              — React Query hooks + useAuthListener (Supabase → auth store)
app/auth/callback/  — Google OAuth code exchange (PKCE)
docs/
  rate-limiting.md  — Rate limit endpoints, keys, limits (enforced by .NET backend)
proxy.ts            — Next.js middleware — Supabase session refresh (getClaims); no redirect logic
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
