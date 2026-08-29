import Section from "@/components/Section/Sections";
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
    <Section id="itinerary" title="">
      <div className="mb-8">
        <h2 className="text-headline-lg text-text">Your itinerary</h2>
        <p className="text-body-md text-text-muted mt-1">
          {itinerary.length} days ·{" "}
          {isConfirmed
            ? "customised for your trip"
            : "as per the selected package"}
        </p>
      </div>
      <ItineraryView itinerary={itinerary} />
    </Section>
  );
}
