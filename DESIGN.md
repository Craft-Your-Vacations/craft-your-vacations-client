---
name: The Nocturnal Voyager
description: A dark-led, glass-and-cyan design system for a bespoke luxury travel platform.
colors:
  signature-cyan: "#75d2f7"
  cyan-deep: "#3a9fc2"
  teal-cta: "#006782"
  ink-base: "#080808"
  ink-bg: "#0e0e0e"
  ink-surface-low: "#161616"
  ink-surface: "#1c1c1c"
  ink-surface-high: "#242424"
  ink-surface-highest: "#2e2e2e"
  text-primary: "#e2e4e8"
  text-muted: "#8d9499"
  text-subtle: "#525a62"
  error: "#f87171"
  warning: "#fbbf24"
  success: "#4ade80"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Exo 2, sans-serif"
    fontSize: "clamp(2.5rem, 9vw, 6.5rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Exo 2, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Exo 2, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Exo 2, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  xl: "0.75rem"
  2xl: "1rem"
  3xl: "1.5rem"
  full: "9999px"
spacing:
  field: "0.75rem"
  card: "1.5rem"
  section: "5rem"
components:
  button-primary:
    backgroundColor: "{colors.signature-cyan}"
    textColor: "{colors.ink-bg}"
    rounded: "{rounded.2xl}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.signature-cyan}"
    rounded: "{rounded.2xl}"
    padding: "12px 24px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.xl}"
    padding: "12px 24px"
  button-icon:
    backgroundColor: "{colors.ink-surface-high}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.full}"
    height: "48px"
    width: "48px"
  input:
    backgroundColor: "{colors.ink-surface-highest}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "12px 16px"
  card-surface:
    backgroundColor: "{colors.ink-surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.2xl}"
    padding: "24px"
  chip:
    backgroundColor: "{colors.ink-surface-high}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  dialog:
    backgroundColor: "{colors.ink-surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.3xl}"
    padding: "32px"
---

# Design System: The Nocturnal Voyager

## Overview

**Creative North Star: "The Nocturnal Voyager"**

This is a design system built for dreaming at night — the moment a traveler opens a new tab after dark and imagines somewhere far away. It is dark-led by identity, not by default: near-black surfaces recede so that full-bleed destination photography and a single signature cyan carry all the light in the room. Depth comes from frosted glass and layered tonal surfaces rather than heavy borders or drop shadows, giving the interface the calm, unhurried feel of a private concierge rather than a busy booking engine.

The system is disciplined about restraint. Type is set in a confident geometric display face (Bricolage Grotesque) for aspiration and a clean humanist sans (Exo 2) for everything readable; color is almost entirely neutral ink, with cyan spent sparingly on the things that matter — the next action, the active state, the accent word. The whole thing adapts to a light theme for daytime and accessibility, but the nocturnal resolution is the canonical identity and the one the brand leads with.

The single source of truth is `app/globals.css`: every color, type step, radius, and signature effect is a token or `@utility` there. Components must consume tokens, never hardcode hex, and never reinvent a pattern the utility layer already owns. The values in this file's frontmatter capture the **dark (signature) resolution**; the light theme is the adaptive counterpart of the same tokens.

**Key Characteristics:**
- Dark-led glassmorphism with photography as the primary light source
- One signature cyan (`#75d2f7`), spent sparingly on action and accent
- Tonal surface ladder (six steps) instead of borders for hierarchy
- Fluid, poster-scale display type over a clean humanist body face
- Fully token-driven and dual-theme; nocturnal is canonical

## Colors

An almost-monochrome ink palette lit by a single cyan accent; status colors are the only other hues and they flip brightness per theme for contrast.

### Primary
- **Signature Cyan** (`#75d2f7`): The one brand accent. Lives in `--color-primary-app` and is **identical in both themes**. Drives primary CTAs, active states, the accent word in headings, focus rings, chip icons, and the hero glow. In dark theme it is also `--color-primary`; in light theme `--color-primary` deepens to Teal CTA for contrast on pale surfaces.
- **Cyan Deep** (`#3a9fc2`): The gradient partner (`--color-gradient-end`) and dark-theme hover. Pairs with Signature Cyan in the primary-button gradient (`btn-gradient`, 135°).
- **Teal CTA** (`#006782`): The light-theme resolution of `--color-primary` — a deep teal that keeps CTA contrast on pale backgrounds. Not used in dark theme.

### Neutral
- **Ink ladder** (`#080808` base → `#0e0e0e` bg → `#161616` surface-low → `#1c1c1c` surface → `#242424` surface-high → `#2e2e2e` surface-highest): Six near-black steps that build hierarchy by tonal layering — sunken cards, page, section bands, cards/navbar, modals/menus, inputs — in that order of lightness. The light theme mirrors this as a pale ladder (`#ffffff` → `#e0e3e5`).
- **Text ramp** (`#e2e4e8` primary → `#8d9499` muted → `#525a62` subtle): On-surface text, secondary text, and tertiary/disabled text respectively (light theme: `#191c1e` → `#3e484d` → `#8a9499`).
- **Ghost Outline** (`rgba(120,120,120,0.15)`): The near-invisible `--color-outline` border used only where accessibility needs an edge, not for decoration.

### Semantic Status (never raw palette colors)
- **Error** (`#f87171` dark / `#dc2626` light), **Warning** (`#fbbf24` / `#d97706`), **Success** (`#4ade80` / `#16a34a`): Consumed only via `text-error` / `bg-error/10` / `text-warning` / `text-success` etc. Each is tuned for contrast per theme.

### Named Rules
**The One Cyan Rule.** Signature Cyan is the only decorative color; spend it on ≤10% of any screen — the next action, the active state, one accent word. Its rarity is what makes it read as luxury. Everything else is ink and photography.

**The Tonal-Ladder Rule.** Depth is built by moving up the six-step surface ladder, not by adding borders or shadows. A card on a page is `surface` on `bg`; an input inside it is `surface-highest`. If two things need to feel separated, change the surface step before reaching for a border.

**The Semantic-Status Rule.** Error/warning/success come only from the three semantic tokens, which adapt per theme. Never `text-red-*`, `bg-amber-*`, `text-green-*`. (Sole exception: the WhatsApp FAB's brand green.)

## Typography

**Display Font:** Bricolage Grotesque (falls back to Exo 2, then sans-serif) — variable `--font-display`
**Body Font:** Exo 2 (falls back to sans-serif) — variable `--font-body`

**Character:** Bricolage brings warm, slightly idiosyncratic geometry to headlines — aspirational without being cold — while Exo 2 keeps body and UI text clean, humanist, and highly legible. The pairing is confident at large sizes and quiet at small ones.

### Hierarchy
- **Display** (Bricolage, 800, `clamp(2.5rem→6.5rem)` fluid for hero / fixed steps `text-display-xl` 60px … `text-display-sm` 32px, line-height 0.9–1.2, tracking −0.02 to −0.04em): Poster-scale hero statements and section openers. Tight leading, negative tracking, always display font.
- **Headline** (Exo 2, 600–700, 28 / 22 / 18px via `text-headline-lg|md|sm`, line-height 1.25–1.35): Card titles, section subheads, dialog titles.
- **Body** (Exo 2, 400, 16 / 15 / 14px via `text-body-lg|md|sm`, line-height ~1.6): All reading copy. `text-body-sm-bold` (700) for emphasized small text.
- **Label** (Exo 2, 600, 12 / 11px via `text-label-md|sm`, letter-spacing 0.05em, **uppercase**): Eyebrows, field labels, chip text, metadata. Uppercase + tracked is the system's "small caps" voice.

### Named Rules
**The Named-Scale Rule.** Copy always uses a named step (`text-body-*`, `text-label-*`, `text-headline-*`, `text-display-*`) — never raw `text-sm` / `text-lg` for text. Raw Tailwind sizes are permitted only for sizing icon glyphs.

**The Accent-Word Rule.** The hero's one emphasized word uses the theme-independent `text-outline-hero` treatment (cyan stroke + dark fill + glow) so it renders identically in light and dark. Don't restyle it per theme.

## Layout

Mobile-first with a single `md:` breakpoint (768px) — no `sm:` / `lg:` / `xl:` unless truly unavoidable. Side-by-side layouts default to `flex-col` and become `md:flex-row`.

- **Container:** `mx-auto max-w-(--container-max-w) px-6 md:px-10`, where `--container-max-w` is `90rem` (1440px). This exact recipe is shared by `Section`, `Footer`, `Navbar`, and page heroes.
- **Page gutter:** `px-6` mobile / `md:px-10` desktop — **never** `px-4` or `px-8`.
- **Section rhythm:** vertical breathing via `--section-gap` (80px), applied through the `section-gap` utility or the `Section` component.
- **Hero heights:** `--hero-height` 75vh, `--hero-height-compact` 65vh.
- **Density:** generous. Cards use `p-6` (compact `p-5`); large hero/auth panels may go `p-8`/`p-10`; dialogs `p-8`.

## Elevation & Depth

This is a **tonal + glass** system, not a shadow system. Primary depth comes from (1) moving up the six-step ink surface ladder and (2) frosted glass (`backdrop-filter: blur`) on floating chrome. Shadows are used sparingly and softly — as ambient lift or a faint cyan halo — never as hard drop shadows.

### Shadow Vocabulary
- **Ambient float** (`shadow-ambient` = `box-shadow: 0 8px 48px 0 rgba(11,19,38,0.08)`): Diffuse lift for elevated panels, primary buttons, and package cards. The default "this floats" shadow.
- **Cyan halo** (`shadow-lg shadow-primary/20`, hover `shadow-primary/30`): A soft tinted glow for imagery cards (destination, review, hero cards) and the dialog panel. Small negative-spread shadow that reads as a gentle brand-colored bloom rather than a cast shadow — chosen specifically so it doesn't clip harshly at carousel edges.
- **Glass** (`glass` utility = `var(--glass-bg)` + `blur(var(--glass-blur))`): The frosted material for navbar, floating cards, `Surface`, and dark-theme modals. Depth without a shadow.

### Named Rules
**The Soft-Depth Rule.** Elevation is ambient (`shadow-ambient`) or a cyan halo (`shadow-primary/20`) — nothing else. No `shadow-xl`, no `shadow-black/*`, no hard multi-layer drop shadows. Reach for a surface step or glass before a shadow.

**The Floating-Glass Rule.** In-flow glass containers — `Surface`, `EmptyState`, `InfoChip` — are **flat** (no shadow); the frosted material and tonal layering carry them within the content. Only glass that **floats alone above the page** carries the cyan halo (`shadow-lg shadow-primary/20`): the `Dialog` panel and the full-viewport-centered `ErrorState`. Test: if it sits where content would sit, it's flat; if it floats over an empty/backdrop context, it gets the halo.

## Shapes

Corner radius is **role-based and proportional — control < card < modal** — so radius signals what kind of element you're looking at:

| Role | Radius | Applies to |
|---|---|---|
| Solid button | `rounded-2xl` (16px) | Button primary / secondary / error |
| Input / small control | `rounded-xl` (12px) | inputs, selects, textareas, icon tiles, nav items, ghost/text buttons |
| Card / panel | `rounded-2xl` (16px) | `Surface`, content cards, dropzones |
| Large panel | `rounded-3xl` (24px) | hero/auth panels, `EmptyState`, dialogs |
| Pill / avatar | `rounded-full` | chips, avatars, icon buttons, FABs |

Borders are rare and quiet — the Ghost Outline (`border-outline`) only where an edge is genuinely needed. Form language is soft-cornered and pill-forward: metadata and status are pills, actions are moderately rounded, panels are gently rounded, modals most of all.

## Components

### Buttons
- **Shape:** Solid variants `rounded-2xl` (16px); ghost/text `rounded-xl`; icon/overlay `rounded-full`.
- **Primary:** `btn-gradient` (135° Signature Cyan → Cyan Deep) with `--color-on-primary` text, `shadow-ambient`, `hover:opacity-90`. Sizes `xs→lg` map padding + a named text step (`px-6 py-3 text-body-md` at `md`).
- **Secondary:** `border-2 border-primary/30` → `hover:border-primary`, `text-primary`, `hover:bg-primary/5`. Outlined, no fill.
- **Ghost:** transparent, `text-text-muted` → `hover:text-primary hover:bg-surface-high`.
- **Icon:** circular `bg-surface-high text-text-muted` → `hover:text-primary`; square sizing (`w-9 h-9` sm → `w-14 h-14` lg).
- **Overlay:** circular `bg-black/40 backdrop-blur-sm text-white` for controls over photography.
- **Error:** `bg-error text-white shadow-ambient`.
- **Loading:** the `loading` prop swaps children for a spinner and disables — never change label text to "Saving…".

### Chips
- **Info chip** (`InfoChip`): `rounded-2xl bg-surface-high border border-outline`, `px-4 py-3` — bordered key/value facts.
- **Pill chip:** `rounded-full px-3 py-1 text-label-sm` — status, city, and filter tags. Cyan icon (`text-primary-app`) inside a translucent `bg-white/10 border-white/15` pill on photography.

### Cards / Containers
- **Surface** (glass primitive): `glass rounded-2xl p-6 flex flex-col gap-5` (default) or `glass rounded-2xl overflow-hidden` (table — flush, clips children). The canonical panel; don't hand-roll glass.
- **Imagery cards** (destination / landscape / hero / review): `rounded-2xl`/`rounded-3xl`, full-bleed `next/image`, a masked frosted footer (blur fades in only low-down so the photo stays sharp up top), `shadow-lg shadow-primary/20`, and a `hover:-translate-y-*` lift (transform only, GPU-composited).
- **Internal padding:** `p-6` default, `p-5` compact, `p-8`+ for hero/auth.

### Inputs / Fields
- **Style:** `bg-surface-highest border border-outline rounded-xl px-4 py-3 text-body-md`, placeholder `text-text-subtle`. Optional leading icon shifts padding to `pl-10`.
- **Label:** `text-label-md text-text-muted` (uppercase), required marked with a cyan `*`.
- **Focus:** `focus:border-transparent focus:ring-2 focus:ring-primary/50` — a cyan ring, no border color shift.
- **Error:** `ring-2 ring-error/50 border-error/50` + a `text-body-sm text-error` message below; helper text uses `text-text-subtle`.
- Use the shared `FormField` / `SelectField` / `TextAreaField` (label optional — omit for compact/inline fields); never hand-roll a raw `<input>`.

### Navigation
- **Navbar:** fixed, full-width, `h-20`, transparent over hero photography (with a top scrim gradient) and flips to solid/`glass` on scroll or non-hero routes via `transition-colors`. Uses the shared container recipe. Logo + wordmark on the left.
- **Active/hover:** links resolve toward `text-primary` (cyan); active route emphasized.

### Dialog (signature)
- Always built on the `Dialog` base (portal + backdrop + panel) — never hand-rolled overlays. Backdrop `bg-overlay/60 backdrop-blur-sm`; panel `modal-panel` (opaque white in light, glass in dark) `shadow-lg shadow-primary/20 rounded-3xl p-8`. `size="sm"` for confirmations, `size="lg"` for forms. Every dialog gets its own `<Name>Dialog` component; queries/mutations and open state live in the page, local UI state in the component.

## Do's and Don'ts

### Do:
- **Do** define every color, type step, radius, and effect as a token or `@utility` in `globals.css`, and consume it — check `globals.css` before introducing anything new.
- **Do** build depth with the six-step surface ladder and glass first; use only `shadow-ambient` or `shadow-primary/20` when a shadow is genuinely needed.
- **Do** use role-based radii (control `rounded-xl` < card/button `rounded-2xl` < modal/large panel `rounded-3xl`, pills `rounded-full`).
- **Do** name every text size (`text-body-*`, `text-label-*`, `text-headline-*`, `text-display-*`); reserve raw `text-sm`/`text-lg` for icon glyphs only.
- **Do** reach for the shared component (`Button`, `Surface`, `FormField`, `Dialog`, `EmptyState`, `InfoChip`, `SelectField`, `TextAreaField`) instead of re-inventing its markup.
- **Do** design mobile-first with a single `md:` breakpoint and the `px-6 md:px-10` / `max-w-(--container-max-w)` container.

### Don't:
- **Don't** hand-roll a control when a shared primitive fits (`Button`, `FormField`, `SelectField`, `TextAreaField`, `Dialog`, `EmptyState`). Exception: a card whose **entire surface is a `<Link>`** uses a styled non-interactive `<span>` for its CTA (e.g. `DestinationCard`'s "Explore"), never a nested `<Button>` — an interactive element inside an `<a>` is invalid HTML. File inputs (`<input type="file">` behind a styled `<label>`) and custom widgets like a star-rating picker are also legitimately raw.
- **Don't** hardcode a hex value in a component — always a token.
- **Don't** use raw palette colors for status (`text-red-*`, `bg-amber-*`, `text-green-*`); use `text-error` / `text-warning` / `text-success`.
- **Don't** introduce hard or heavy shadows (`shadow-xl`, `shadow-black/*`, stacked drop shadows) — they violate the Soft-Depth Rule.
- **Don't** use off-scale radii (`rounded-lg`, `rounded-md`) — snap to the role-based `xl` / `2xl` / `3xl` / `full` set.
- **Don't** use `px-4` or `px-8` as the page gutter; the gutter is `px-6 md:px-10`.
- **Don't** overspend the cyan — one accent per view, ≤10% of the screen.
- **Don't** hand-roll overlays, glass panels, or raw inputs when a shared primitive exists.
