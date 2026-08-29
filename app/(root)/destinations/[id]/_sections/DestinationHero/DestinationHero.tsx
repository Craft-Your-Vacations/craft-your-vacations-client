import GlassHero, { type HeroStat } from "@/components/GlassHero/GlassHero";
import type { DestinationDetail } from "@/app/types/api";

interface DestinationHeroProps {
  destination: DestinationDetail;
}

export default function DestinationHero({ destination }: DestinationHeroProps) {
  const { title, imagePath, content, destinationCities, packages } = destination;

  // Prices are intentionally omitted — packages are customizable, so we don't
  // advertise a starting price anywhere.
  const days = packages.map((p) => p.days);
  const stats: HeroStat[] = [
    ...(packages.length
      ? [{ value: String(packages.length), label: packages.length === 1 ? "Package" : "Packages" }]
      : []),
    ...(days.length ? [{ value: `${Math.min(...days)}–${Math.max(...days)}`, label: "Days" }] : []),
  ];

  return (
    <GlassHero
      image={imagePath}
      imageAlt={title}
      eyebrow="Discover"
      title={title}
      description={content}
      tags={destinationCities}
      stats={stats}
      cta={{ label: "Explore Packages", href: "#packages" }}
    />
  );
}
