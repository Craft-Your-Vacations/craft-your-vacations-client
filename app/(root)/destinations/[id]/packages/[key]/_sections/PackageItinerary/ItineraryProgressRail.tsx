import type { PackageDetail } from "@/app/types/api";

interface ItineraryProgressRailProps {
  itinerary: PackageDetail["itinerary"];
}

export default function ItineraryProgressRail({
  itinerary,
}: ItineraryProgressRailProps) {
  return (
    <div className="hidden lg:flex lg:col-span-1 flex-col items-center pt-5 gap-0">
      <div className="relative flex flex-col items-center h-full">
        <div className="absolute top-3 bottom-3 w-px bg-outline" />
        {itinerary.map((day, i) => (
          <div
            key={day.dayNumber}
            className="relative z-10 flex flex-col items-center"
            style={{
              marginTop: i === 0 ? 0 : `${100 / itinerary.length}%`,
            }}
          >
            <div className="w-8 h-8 rounded-full bg-primary/15 border-2 border-primary/50 flex items-center justify-center text-primary text-label-sm font-bold">
              {day.dayNumber}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
