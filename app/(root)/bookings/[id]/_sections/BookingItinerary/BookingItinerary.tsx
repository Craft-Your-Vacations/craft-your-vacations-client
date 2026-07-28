import Surface from "@/components/Surface/Surface";
import ItineraryView from "@/components/ItineraryView/ItineraryView";
import type { Booking } from "@/app/types/api";

interface BookingItineraryProps {
  itinerary: Booking["confirmedItinerary"];
  isConfirmed: boolean;
}

export default function BookingItinerary({
  itinerary,
  isConfirmed,
}: BookingItineraryProps) {
  if (!itinerary || itinerary.length === 0) return null;

  return (
    <Surface className="gap-4">
      <div>
        <h2 className="text-headline-sm text-text">Your Itinerary</h2>
        <p className="text-body-sm text-text-muted mt-1">
          {itinerary.length} days ·{" "}
          {isConfirmed
            ? "customised for your trip"
            : "as per the selected package"}
        </p>
      </div>
      <ItineraryView itinerary={itinerary} />
    </Surface>
  );
}
