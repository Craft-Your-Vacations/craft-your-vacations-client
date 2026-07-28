import Section from "@/components/Section/Sections";
import DestinationCard from "@/components/DestinationCard/DestinationCard";
import DestinationLandscapeCard from "@/components/DestinationLandscapeCard/DestinationLandscapeCard";
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
      {/* Mobile: portrait cards, 1 column */}
      <div className="lg:hidden grid grid-cols-1 gap-4">
        {destinations.map((destination) => (
          <DestinationCard
            key={destination.id}
            href={`/destinations/${destination.slug}`}
            imagePath={destination.imagePath}
            title={destination.title}
            destinationCities={destination.destinationCities}
            content={destination.content}
          />
        ))}
      </div>

      {/* Desktop: landscape cards */}
      <div className="hidden lg:flex flex-col gap-5">
        {destinations.map((destination, index) => (
          <DestinationLandscapeCard
            key={destination.id}
            href={`/destinations/${destination.slug}`}
            panelLeft={index % 2 === 0}
            imagePath={destination.imagePath}
            title={destination.title}
            destinationCities={destination.destinationCities}
            content={destination.content}
          />
        ))}
      </div>
    </Section>
  );
}
