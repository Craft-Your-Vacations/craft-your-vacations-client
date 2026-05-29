"use client";

import ItineraryDay from "@/components/ItineraryDay/ItineraryDay";
import type { ItineraryDay as ItineraryDayType } from "@/app/types/api";

interface ItineraryViewProps {
  itinerary: ItineraryDayType[];
}

export default function ItineraryView({ itinerary }: ItineraryViewProps) {
  if (itinerary.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {itinerary.map((day, index) => (
        <ItineraryDay
          key={day.dayNumber}
          dayNumber={day.dayNumber}
          title={day.title}
          activities={day.activities}
          defaultOpen={index === 0}
        />
      ))}
    </div>
  );
}
