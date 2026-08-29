import Section from "@/components/Section/Sections";
import DestinationsShowcase from "@/components/DestinationsShowcase/DestinationsShowcase";
import type { Destination } from "@/app/types/api";

interface PopularDestinationsProps {
  destinations: Destination[];
}

export default function PopularDestinations({
  destinations,
}: PopularDestinationsProps) {
  if (destinations.length === 0) return null;

  return (
    <Section id="popular-destinations" title="">
      <div className="mb-8">
        <h2 className="text-headline-lg text-text">
          Explore more destinations
        </h2>
        <p className="text-body-md text-text-muted mt-1">
          Continue your journey somewhere new
        </p>
      </div>

      {/* Unnumbered: this is a short related strip, not the whole catalogue. */}
      <DestinationsShowcase destinations={destinations} numbered={false} />
    </Section>
  );
}
