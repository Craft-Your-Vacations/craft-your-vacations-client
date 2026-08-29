import GlassHero from "@/components/GlassHero/GlassHero";
import type { PackageDetail, DestinationDetail } from "@/app/types/api";

interface PackageHeroProps {
  pkg: PackageDetail;
  destination: DestinationDetail | undefined;
  totalActivities: number;
}

export default function PackageHero({ pkg, destination }: PackageHeroProps) {
  return (
    <GlassHero
      image={destination?.imagePath}
      imageAlt={destination?.title}
      eyebrow={destination?.title}
      title={pkg.title}
      description={pkg.excerpt}
      cta={{ label: "View Itinerary", href: "#itinerary" }}
    />
  );
}
