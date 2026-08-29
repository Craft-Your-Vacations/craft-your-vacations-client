import { MapPin } from "lucide-react";
import Chip from "@/components/Chip/Chip";

interface RouteWaypointProps {
  /** Optional running label, e.g. "Destination 02 / 12". */
  label?: string;
  /** Every city for this destination — the card itself only shows the first three. */
  cities: string[];
}

// The column that sits opposite a landscape card on desktop. It carries the
// route thread (line → pin → line) plus the meta the card has no room for, so
// the alternating layout reads as a journey log instead of dead space.
export default function RouteWaypoint({ label, cities }: RouteWaypointProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 py-2">
      <span
        aria-hidden="true"
        className="w-px flex-1 bg-linear-to-b from-transparent to-primary/40"
      />

      <div className="flex flex-col items-center gap-4 text-center">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/40 bg-primary/10"
        >
          <MapPin className="h-5 w-5 text-primary" strokeWidth={1.75} />
        </span>

        {label && (
          <span className="text-label-md text-text-subtle">{label}</span>
        )}

        {cities.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {cities.map((city) => (
              <Chip key={city} variant="onSurface">
                {city}
              </Chip>
            ))}
          </div>
        )}
      </div>

      <span
        aria-hidden="true"
        className="w-px flex-1 bg-linear-to-b from-primary/40 to-transparent"
      />
    </div>
  );
}
