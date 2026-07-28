import { Clock, Calendar, Zap, ScrollText, MapPin } from "lucide-react";
import Section from "@/components/Section/Sections";
import Surface from "@/components/Surface/Surface";
import IconBadge from "@/components/IconBadge/IconBadge";
import InfoChip from "@/components/InfoChip/InfoChip";
import Button from "@/components/Button/Button";
import type { PackageDetail, DestinationDetail } from "@/app/types/api";

interface PackageOverviewProps {
  pkg: PackageDetail;
  destination: DestinationDetail | undefined;
  totalActivities: number;
  onBook: () => void;
}

export default function PackageOverview({
  pkg,
  destination,
  totalActivities,
  onBook,
}: PackageOverviewProps) {
  return (
    <Section id="overview" title="">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: description */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div>
            <h2 className="text-headline-lg text-text mb-3">
              About this package
            </h2>
            <p className="text-body-lg text-text-muted leading-relaxed">
              {pkg.excerpt}
            </p>
          </div>

          {/* Stat chips row */}
          <div className="flex flex-wrap gap-3">
            <InfoChip>
              <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-label-sm text-text-muted uppercase tracking-widest">
                  Duration
                </p>
                <p className="text-body-md text-text font-medium">
                  {pkg.days} Days
                </p>
              </div>
            </InfoChip>

            <InfoChip>
              <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-label-sm text-text-muted uppercase tracking-widest">
                  Activities
                </p>
                <p className="text-body-md text-text font-medium">
                  {totalActivities} total
                </p>
              </div>
            </InfoChip>

            <InfoChip>
              <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                <ScrollText className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-label-sm text-text-muted uppercase tracking-widest">
                  Itinerary
                </p>
                <p className="text-body-md text-text font-medium">
                  {pkg.itinerary.length} days planned
                </p>
              </div>
            </InfoChip>
          </div>
        </div>

        {/* Right: Trip summary glass card */}
        <Surface className="h-fit">
          <h3 className="text-headline-sm text-text">Trip Summary</h3>

          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <IconBadge>
                <Clock className="w-4 h-4 text-primary" />
              </IconBadge>
              <div>
                <p className="text-label-sm text-text-muted uppercase tracking-widest mb-0.5">
                  Duration
                </p>
                <p className="text-body-md text-text font-medium">
                  {pkg.days} days / {pkg.days - 1} nights
                </p>
              </div>
            </div>

            {destination && (
              <>
                <div className="h-px bg-outline" />
                <div className="flex items-start gap-3">
                  <IconBadge>
                    <MapPin className="w-4 h-4 text-primary" />
                  </IconBadge>
                  <div>
                    <p className="text-label-sm text-text-muted uppercase tracking-widest mb-0.5">
                      Destination
                    </p>
                    <p className="text-body-md text-text font-medium">
                      {destination.title}
                    </p>
                    <p className="text-body-sm text-text-muted">
                      {destination.destinationCities.join(", ")}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <Button
            variant="primary"
            onClick={onBook}
            className="w-full justify-center mt-2"
          >
            Book This Package
          </Button>
        </Surface>
      </div>
    </Section>
  );
}
