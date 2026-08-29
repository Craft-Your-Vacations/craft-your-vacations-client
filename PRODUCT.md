# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Affluent Indian travelers planning premium **outbound** (international) vacations. They arrive wanting more than a fixed package tour: they want a trip shaped to their own pace, taste, and sense of wonder, and they are willing to invest time crafting it. Their job is to discover destinations worth their time, assemble a day-by-day itinerary they trust, and book it with confidence that the details are handled.

A second audience is the **agency's own operators** (Admin role), who curate the destination and package inventory, confirm itineraries, manage bookings and required documents, and moderate reviews.

## Product Purpose

CraftYourVacations is a bespoke travel-planning and booking platform. It lets a traveler browse a hand-curated set of signature destinations and packages, **craft an itinerary day by day**, book the trip, submit the travel documents it requires, and later leave a review. Success is a traveler who moves from inspiration to a confidently booked, personalized trip — and an operator who can manage the curated catalog and every booking's lifecycle from one place.

## Positioning

The differentiator is **day-by-day itinerary crafting** — the traveler shapes every stay, experience, and detour themselves rather than accepting a fixed package. This is the promise behind the brand line "Dream. Craft. Live." and "Build your itinerary day by day … yours to shape exactly as you imagine." A generic booking site that only sells fixed packages could not truthfully make this claim. Curation and a confident, detail-handled hand-off support the promise, but the crafting mechanism is the core.

## Operating Context

Primary traveler flow: land on the home experience → browse curated destinations → open a destination (hero, photo gallery, packages, reviews, memories) → choose a package → **book** (travelers count, travel date, notes) → **upload required documents** (PAN and/or passport) → the operator confirms the itinerary → after travel, leave a **review** (rating, quote, images). Auth is India-shaped: phone verification via **+91 OTP** during onboarding, PAN/passport as the document types. Booking lifecycle statuses: `pending → confirmed → completed → cancelled`.

Operator (Admin) flow: manage destinations and packages (including the day-by-day **itinerary editor**), manage bookings and set each booking's **required documents**, view customers, and moderate reviews.

## Capabilities and Constraints

- **Confirmed capabilities:** curated destination + package catalog; day-by-day itinerary building/editing; booking with travelers/date/notes; per-booking required-document requests (PAN, passport); document upload; ratings-and-quote reviews with images; customer profile with onboarding (phone OTP, optional DOB/nationality/residence/profession); email verification (non-blocking banner flow); full admin surface for destinations, packages, bookings, customers, and reviews.
- **Terminology:** "destination" (a curated place), "package" (a bookable offering under a destination), "itinerary" / "itinerary day" / "activity", "booking", "required documents", "memories" and "testimonials" (customer-experience content on destination/home surfaces).
- **Constraints:** web app; stack is fixed and non-negotiable (Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Supabase auth, .NET/Postgres backend). Design system is **"The Nocturnal Voyager"** with tokens in `globals.css`; conventions in `AGENTS.md` are binding (semantic status tokens, role-based radii, shared component layer, mobile-first with a single `md:` breakpoint).
- **Current market scope:** India-outbound only. Nothing in the product yet supports domestic-India or non-India customers; do not assume multi-currency, multi-locale, or non-`+91` phone support exists.

## Brand Commitments

- **Name:** CraftYourVacations. **Signature line:** "Dream. Craft. Live."
- **Voice:** aspirational, evocative, second-person, confident-but-warm. Speaks to curiosity and ownership of the journey ("on your terms", "yours to shape exactly as you imagine", "signature destinations", "No surprises unless you want them"). Never generic OTA / discount-travel tone.
- **Design identity:** "The Nocturnal Voyager" — a dark-led, glass/nocturnal aesthetic is an established brand commitment, not incidental.
- The brand is real (a pre-launch travel agency), so brand name, voice, and design identity must be preserved by future work.

## Evidence on Hand

- **Real product content:** curated destinations, packages, and itineraries exist in the system as genuine catalog data.
- **No public proof yet — pre-launch.** There are **no** real customer testimonials, verified reviews, "memories", customer counts, ratings, awards, or press. Any testimonial/review/"memories" content currently displayed is **placeholder** and must be treated as such: future work must not fabricate customer quotes, star counts, "10,000+ travelers"-style figures, logos, or press mentions. When a surface needs social proof, flag the absence rather than inventing it.

## Product Principles

1. **Crafting is the product.** Every surface should move the traveler toward shaping and owning their own itinerary — not just picking a fixed deal.
2. **Curation over catalog.** A tight, hand-picked set of signature destinations beats an exhaustive list; scarcity and quality are features.
3. **Confidence through handled detail.** The traveler dreams and crafts; the agency guarantees the details ("No surprises unless you want them"). Reduce friction and anxiety at booking, documents, and hand-off.
4. **India-outbound reality.** Honor the actual audience — +91, PAN/passport, outbound aspiration — rather than a generic global-traveler abstraction.
5. **Earned aspiration, not hype.** Aspirational voice and nocturnal craft, but never fabricated proof; withhold claims the pre-launch business can't yet back.
