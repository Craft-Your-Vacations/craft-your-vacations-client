import GlassHero, { type HeroStat } from "@/components/GlassHero/GlassHero";
import HeroImage from "@/public/introImage2.jpg";
import type { Destination } from "@/app/types/api";

interface DestinationsHeroProps {
  destinations: Destination[];
}

// Index-page counterpart of the destination/package detail heroes: the same
// hard-edged glass panel over full-bleed photography, with the "Horizon" accent
// word carried over from the previous page header.
export default function DestinationsHero({
  destinations,
}: DestinationsHeroProps) {
  const cityCount = new Set(
    destinations.flatMap((d) => d.destinationCities),
  ).size;

  const stats: HeroStat[] = [
    {
      value: String(destinations.length),
      label: destinations.length === 1 ? "Destination" : "Destinations",
    },
    ...(cityCount
      ? [{ value: String(cityCount), label: cityCount === 1 ? "City" : "Cities" }]
      : []),
  ];

  return (
    <GlassHero
      image={HeroImage}
      imageAlt="A camper van on an open desert road"
      eyebrow="The Collection"
      title="The Curated"
      titleAccent="Horizon"
      description="Hand-picked journeys that bridge the gap between luxury and raw exploration. Every destination below is one we'd travel to ourselves — your next story begins here."
      stats={stats}
      cta={{ label: "Browse destinations", href: "#destinations" }}
      scrollCue="Scroll to browse destinations"
    />
  );
}
