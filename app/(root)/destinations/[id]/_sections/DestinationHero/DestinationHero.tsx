import { Package, Clock } from "lucide-react";
import PageHero from "@/components/PageHero/PageHero";
import type { DestinationDetail } from "@/app/types/api";

interface DestinationHeroProps {
  destination: DestinationDetail;
}

export default function DestinationHero({ destination }: DestinationHeroProps) {
  const { title, imagePath, packages, destinationCities } = destination;

  return (
    <PageHero
      imagePath={imagePath}
      imageAlt={title}
      title={title}
      tags={destinationCities}
      chips={[
        {
          icon: <Package className="w-4 h-4" />,
          label: `${packages.length} Packages`,
        },
        {
          icon: <Clock className="w-4 h-4" />,
          label: `${Math.min(...packages.map((p) => p.days))}–${Math.max(...packages.map((p) => p.days))} Days`,
        },
      ]}
    />
  );
}
