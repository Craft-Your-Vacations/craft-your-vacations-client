import DestinationCard from "@/components/DestinationCard/DestinationCard";
import DestinationLandscapeCard from "@/components/DestinationLandscapeCard/DestinationLandscapeCard";
import Reveal from "@/components/motion/Reveal";
import type { Destination } from "@/app/types/api";
import RouteWaypoint from "./RouteWaypoint";

interface DestinationsShowcaseProps {
  destinations: Destination[];
  /**
   * Numbered waypoints ("Destination 02 / 12") suit the full catalogue; a
   * short related-destinations strip reads better without a running count.
   */
  numbered?: boolean;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Destinations as landscape cards alternating down the page, each paired with a
 * route/meta column opposite it. Shared by the destinations index and the
 * "explore more" strip on a destination's own page.
 */
export default function DestinationsShowcase({
  destinations,
  numbered = true,
}: DestinationsShowcaseProps) {
  return (
    <>
      {/* Portrait cards. The landscape card's side panel only stays readable
          from ~1024px up, so this is one of the rare places the lg: breakpoint
          is warranted instead of the usual md: split. */}
      <div className="grid grid-cols-1 gap-6 lg:hidden">
        {destinations.map((destination) => (
          <Reveal key={destination.id}>
            <DestinationCard
              href={`/destinations/${destination.slug}`}
              imagePath={destination.imagePath}
              title={destination.title}
              destinationCities={destination.destinationCities}
              content={destination.content}
              isFeatured={destination.isFeatured}
            />
          </Reveal>
        ))}
      </div>

      {/* Desktop: landscape cards alternating sides down the page. The card
          keeps its glass panel on the outer edge so the panel and the meta
          column never crowd each other. */}
      <div className="hidden lg:flex lg:flex-col lg:gap-12">
        {destinations.map((destination, index) => {
          const cardLeft = index % 2 === 0;

          const card = (
            <div className="lg:col-span-9">
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

          const waypoint = (
            <div className="lg:col-span-3">
              <RouteWaypoint
                label={
                  numbered
                    ? `Destination ${pad(index + 1)} / ${pad(destinations.length)}`
                    : undefined
                }
                cities={destination.destinationCities}
              />
            </div>
          );

          return (
            <Reveal
              key={destination.id}
              className="grid min-w-0 grid-cols-1 items-stretch gap-8 lg:grid-cols-12"
            >
              {cardLeft ? (
                <>
                  {card}
                  {waypoint}
                </>
              ) : (
                <>
                  {waypoint}
                  {card}
                </>
              )}
            </Reveal>
          );
        })}
      </div>
    </>
  );
}
