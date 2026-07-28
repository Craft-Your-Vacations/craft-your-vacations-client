import { Package, MapPin } from "lucide-react";
import Section from "@/components/Section/Sections";
import Surface from "@/components/Surface/Surface";
import IconBadge from "@/components/IconBadge/IconBadge";
import type { DestinationDetail } from "@/app/types/api";

interface DestinationOverviewProps {
  destination: DestinationDetail;
}

export default function DestinationOverview({
  destination,
}: DestinationOverviewProps) {
  const { content, packages, destinationCities } = destination;

  return (
    <Section id="destination-info" title="">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Content */}
        <div className="lg:col-span-2">
          <h2 className="text-headline-lg text-text mb-4">
            About this destination
          </h2>
          <p className="text-body-lg text-text-muted leading-relaxed">
            {content}
          </p>
        </div>

        {/* Quick stats */}
        <div className="flex flex-col gap-4">
          <Surface>
            <h3 className="text-headline-sm text-text">At a glance</h3>

            <div className="flex items-start gap-3">
              <IconBadge>
                <MapPin className="w-4 h-4 text-primary" />
              </IconBadge>
              <div>
                <p className="text-label-sm text-text-muted uppercase tracking-widest mb-0.5">
                  Cities
                </p>
                <p className="text-body-md text-text">
                  {destinationCities.join(", ")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <IconBadge>
                <Package className="w-4 h-4 text-primary" />
              </IconBadge>
              <div>
                <p className="text-label-sm text-text-muted uppercase tracking-widest mb-0.5">
                  Packages
                </p>
                <p className="text-body-md text-text">
                  {packages.length} available
                </p>
              </div>
            </div>
          </Surface>
        </div>
      </div>
    </Section>
  );
}
