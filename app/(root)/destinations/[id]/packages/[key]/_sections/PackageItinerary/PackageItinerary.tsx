import Section from "@/components/Section/Sections";
import ItineraryDay from "@/components/ItineraryDay/ItineraryDay";
import type { PackageDetail } from "@/app/types/api";
import ItineraryProgressRail from "./ItineraryProgressRail";

interface PackageItineraryProps {
  pkg: PackageDetail;
  totalActivities: number;
}

export default function PackageItinerary({
  pkg,
  totalActivities,
}: PackageItineraryProps) {
  return (
    <Section id="itinerary" title="">
      <div className="mb-8">
        <h2 className="text-headline-lg text-text">Day-by-Day Itinerary</h2>
        <p className="text-body-md text-text-muted mt-1">
          {pkg.days} days · {totalActivities} activities
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sticky progress rail (desktop) */}
        <ItineraryProgressRail itinerary={pkg.itinerary} />

        {/* Day accordion list */}
        <div className="lg:col-span-11 flex flex-col gap-3">
          {pkg.itinerary.map((day, index) => (
            <ItineraryDay
              key={day.dayNumber}
              dayNumber={day.dayNumber}
              title={day.title}
              activities={day.activities}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
