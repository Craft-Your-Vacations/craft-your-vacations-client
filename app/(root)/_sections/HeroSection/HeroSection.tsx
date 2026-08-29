import { Fragment } from "react";
import Image from "next/image";
import { MapPin, Compass, Headphones, ChevronDown } from "lucide-react";
import HeroImage from "@/public/introImage1.jpg";
import HeroSearch from "@/components/HeroSearch/HeroSearch";
import HeroDestinationCards from "@/components/HeroDestinationCards/HeroDestinationCards";
import type { Destination } from "@/app/types/api";

const highlights = [
  { icon: MapPin, label: "50+ Destinations" },
  { icon: Compass, label: "Bespoke Itineraries" },
  { icon: Headphones, label: "24/7 Concierge" },
];

// Entrance is CSS-driven (animate-hero-rise) with staggered delays so the
// above-the-fold hero is visible immediately without waiting on hydration.
export default function HeroSection({
  destinations,
}: {
  destinations?: Destination[];
}) {
  return (
    // id is observed by the Navbar to toggle its transparent/solid state.
    <section id="hero-sentinel" className="relative min-h-dvh w-full overflow-hidden">
      {/* Full-bleed background photo with a slow Ken Burns zoom/drift */}
      <Image
        src={HeroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="animate-ken-burns object-cover"
      />

      {/* Frosted-glass panel over the left half — rich blur + saturate, deep
          gradient fill, and a hard edge with a thin specular seam. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-full backdrop-blur-2xl backdrop-saturate-150 bg-linear-to-br from-black/75 to-black/45 border-r border-white/10 md:w-1/2"
      />

      {/* Legibility scrim + fine grain */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-black/25" />
      <div aria-hidden className="hero-grain pointer-events-none absolute inset-0" />

      {/* Fanned destination cards filling the clear right side (xl+ only) */}
      {destinations && destinations.length > 0 && (
        <HeroDestinationCards items={destinations} />
      )}

      {/* Content — vertically centred, left-anchored */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full max-w-(--container-max-w) mx-auto px-6 md:px-10">
          {/* Constrain to the left glass half (md+) so copy + search wrap inside it. */}
          <div className="flex w-full flex-col items-start gap-6 md:w-1/2 md:pr-8">
            <p className="animate-hero-rise text-label-md uppercase tracking-widest text-white/70 md:text-label-lg">
              Your journey, in three simple steps
            </p>

            {/* Headline — stacked in the glass; the accent word borrows the
                destinations page treatment: an italic, primary-gradient accent
                against the solid words. */}
            <h1 className="flex w-full flex-col items-start uppercase leading-hero tracking-tighter text-white text-display-lg md:text-display-xl">
              <span
                className="animate-hero-rise drop-shadow-lg"
                style={{ animationDelay: "0.12s" }}
              >
                Dream.
              </span>
              <span
                className="text-outline-hero animate-hero-rise italic text-display-xl md:text-[4.5rem] -ml-1"
                style={{ animationDelay: "0.24s" }}
              >
                Craft.
              </span>
              <span
                className="animate-hero-rise drop-shadow-lg"
                style={{ animationDelay: "0.36s" }}
              >
                Live.
              </span>
            </h1>

            <p
              className="animate-hero-rise max-w-md text-body-md md:text-body-lg font-light leading-relaxed text-white/75"
              style={{ animationDelay: "0.3s" }}
            >
              Bespoke escapes for the discerning traveler — from the silence of
              Nordic fjords to the vibrant pulse of tropical archipelagos.
            </p>

            <div
              className="animate-hero-rise w-full max-w-xl"
              style={{ animationDelay: "0.42s" }}
            >
              <HeroSearch />
            </div>
          </div>
        </div>
      </div>

      {/* Highlight row — plain (no pill), anchored bottom-left within the glass */}
      <div className="absolute inset-x-0 bottom-8 z-10">
        <div className="mx-auto max-w-(--container-max-w) px-6 md:px-10">
          <div
            className="animate-hero-rise flex max-w-full flex-wrap items-center gap-x-5 gap-y-2"
            style={{ animationDelay: "0.55s" }}
          >
            {highlights.map(({ icon: Icon, label }, i) => (
              <Fragment key={label}>
                {i > 0 && (
                  <span aria-hidden className="hidden h-4 w-px bg-white/25 md:block" />
                )}
                <div className="flex items-center gap-2 text-white/80">
                  <Icon className="h-4 w-4 text-primary-app" strokeWidth={1.75} />
                  <span className="text-label-md tracking-widest">{label}</span>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2"
      >
        <ChevronDown className="animate-hero-bob h-5 w-5 text-white/50" />
      </div>
    </section>
  );
}
