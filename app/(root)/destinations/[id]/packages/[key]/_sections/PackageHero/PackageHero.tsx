import { Clock, Zap } from "lucide-react";
import PageHero from "@/components/PageHero/PageHero";
import type { PackageDetail, DestinationDetail } from "@/app/types/api";

interface PackageHeroProps {
  pkg: PackageDetail;
  destination: DestinationDetail | undefined;
  totalActivities: number;
}

export default function PackageHero({
  pkg,
  destination,
  totalActivities,
}: PackageHeroProps) {
  return (
    <PageHero
      imagePath={destination?.imagePath}
      imageAlt={destination?.title}
      title={pkg.title}
      subtitle={pkg.excerpt}
      tags={destination?.destinationCities.slice(0, 2)}
      chips={[
        { icon: <Clock className="w-4 h-4" />, label: `${pkg.days} Days` },
        { icon: <Zap className="w-4 h-4" />, label: `${totalActivities} Activities` },
      ]}
    />
  );
}
