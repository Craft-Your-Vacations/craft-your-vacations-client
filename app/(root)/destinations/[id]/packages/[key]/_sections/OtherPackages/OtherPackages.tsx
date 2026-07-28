import { Clock, ScrollText } from "lucide-react";
import Section from "@/components/Section/Sections";
import PackageCard from "@/components/PackageCard/PackageCard";
import type { DestinationPackage } from "@/app/types/api";

interface OtherPackagesProps {
  packages: DestinationPackage[];
  destinationId: string;
  destinationTitle?: string;
}

export default function OtherPackages({
  packages,
  destinationId,
  destinationTitle,
}: OtherPackagesProps) {
  if (packages.length === 0) return null;

  return (
    <Section id="other-packages" title="">
      <div className="mb-8">
        <h2 className="text-headline-lg text-text">
          More packages
          {destinationTitle ? ` for ${destinationTitle}` : ""}
        </h2>
        <p className="text-body-md text-text-muted mt-1">
          Explore other ways to experience this destination
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((p, index) => (
          <PackageCard
            key={p.key}
            title={p.title}
            duration={`${p.days} Days`}
            href={`/destinations/${destinationId}/packages/${p.key}`}
            features={[
              {
                icon: <Clock className="w-4 h-4" />,
                text: `${p.days}-day itinerary`,
              },
              {
                icon: <ScrollText className="w-4 h-4" />,
                text: p.excerpt,
              },
            ]}
            highlighted={index === Math.floor(packages.length / 2)}
          />
        ))}
      </div>
    </Section>
  );
}
