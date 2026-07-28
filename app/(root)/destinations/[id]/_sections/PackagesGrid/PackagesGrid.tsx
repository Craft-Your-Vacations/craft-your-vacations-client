import { Clock, ScrollText } from "lucide-react";
import Section from "@/components/Section/Sections";
import PackageCard from "@/components/PackageCard/PackageCard";
import type { DestinationPackage } from "@/app/types/api";

interface PackagesGridProps {
  destinationId: string;
  packages: DestinationPackage[];
}

export default function PackagesGrid({
  destinationId,
  packages,
}: PackagesGridProps) {
  if (packages.length === 0) return null;

  return (
    <Section id="packages" title="">
      <div className="mb-8">
        <h2 className="text-headline-lg text-text">Available packages</h2>
        <p className="text-body-md text-text-muted mt-1">
          Choose the journey that fits your style
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg, index) => (
          <PackageCard
            key={pkg.key}
            title={pkg.title}
            duration={`${pkg.days} Days`}
            href={`/destinations/${destinationId}/packages/${pkg.key}`}
            features={[
              {
                icon: <Clock className="w-4 h-4" />,
                text: `${pkg.days}-day itinerary`,
              },
              {
                icon: <ScrollText className="w-4 h-4" />,
                text: pkg.excerpt,
              },
            ]}
            highlighted={index === Math.floor(packages.length / 2)}
          />
        ))}
      </div>
    </Section>
  );
}
