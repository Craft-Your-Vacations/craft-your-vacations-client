import DestinationCard from "@/components/DestinationCard/DestinationCard";
import DestinationLandscapeCard from "@/components/DestinationLandscapeCard/DestinationLandscapeCard";
import type { Destination } from "@/app/types/api";
import RouteWaypoint from "./RouteWaypoint";

interface DestinationsListProps {
  destinations: Destination[];
}

export default function DestinationsList({
  destinations,
}: DestinationsListProps) {
  return (
    <>
      {/* Mobile: portrait grid */}
      <div className="lg:hidden grid grid-cols-1 gap-4 mt-6">
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

      {/* Desktop: landscape cards with waypoints */}
      <div className="hidden lg:flex flex-col gap-5">
        {destinations.map((destination, index) => {
          const cardLeft = index % 2 !== 0;

          const card = (
            <div className="lg:col-span-2">
              <DestinationLandscapeCard
                href={`/destinations/${destination.slug}`}
                panelLeft={cardLeft}
                imagePath={destination.imagePath}
                title={destination.title}
                destinationCities={destination.destinationCities}
                content={destination.content}
              />
            </div>
          );

          return (
            <div
              key={destination.id}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch"
            >
              {cardLeft ? (
                <>
                  {card}
                  <RouteWaypoint />
                </>
              ) : (
                <>
                  <RouteWaypoint />
                  {card}
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
