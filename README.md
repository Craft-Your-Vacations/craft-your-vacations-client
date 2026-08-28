# CraftYourVacations — Web Client

Frontend for CraftYourVacations, a bespoke travel-planning platform (browse curated destinations, craft a day-by-day itinerary, book, upload documents, review). Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Supabase auth · TanStack Query.

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The .NET API is expected at `localhost:5025` (see `lib/bff.ts`).

Useful checks before committing:

```bash
npx tsc --noEmit     # types
npx eslint .         # lint (design-drift + react-hooks rules included)
```

## Design system & component discipline (read this first)

This project follows a documented design system — **"The Nocturnal Voyager"** — and a strict component-reuse discipline. The single most important rule when building or changing any UI:

> **Reuse, extend, never reinvent.**
>
> 1. **Use the existing shared component.** Check `components/` first — there is almost always one that fits. Never hand-roll markup a shared component already provides (a styled `<button>` instead of `Button`, a raw `<input>` instead of `FormField`, a custom overlay instead of `Dialog`, an inline pill instead of `Chip`, …).
> 2. **If the design truly needs something the component can't do, extend the component** — add a `variant`/prop to the primitive so the need is met from one source of truth, then consume it. Don't fork a bespoke copy in the page. "We can't use `Button` here because X" means *make `Button` support X*.
> 3. **Only change a shared component when genuinely needed** — prefer an existing variant; add a new one only when none fits.
> 4. **When the same block appears in 2+ places, extract it** to `components/<Name>/` (or a `lib/` helper) and replace every copy. Duplication is drift waiting to happen.

Alongside reuse, all styling goes through **tokens**, never raw values: role-based corner radii (`control < card < modal`), the semantic status colors (`text-error`/`text-warning`/`text-success`), the named type scale (`text-body-*` / `text-label-*` / `text-headline-*` / `text-display-*`), the soft-depth shadow rule (`shadow-ambient` or `shadow-primary/20` only), and the `px-6 md:px-10` page gutter. New colors/tokens are defined once in `globals.css` — never inline a hex.

### Where the rules live (source of truth)

| Doc | What it covers |
|---|---|
| **`AGENTS.md`** | The full, enforced convention set — component reuse, design tokens, data-fetching layers, auth, state, dialogs. **Start here before writing code.** (Loaded automatically via `CLAUDE.md`.) |
| **`DESIGN.md`** + `.impeccable/design.json` | The written design system: palette, typography, shapes, elevation, named rules, and per-component specs. |
| `globals.css` | The token layer (CSS variables + Tailwind v4 theme) that everything consumes. |
| `docs/rate-limiting.md` | Rate-limit endpoints and limits (enforced by the .NET backend). |

If you add a shared component or lib helper, register it in `AGENTS.md`'s "reach for these shared components" table so the next contributor reuses it.
