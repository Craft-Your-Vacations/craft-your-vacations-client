import Button from "@/components/Button/Button";
import DestinationCard from "@/components/DestinationCard/DestinationCard";
import type { Destination } from "@/app/types/api";

interface CuratedDestinationsProps {
  destinations: Destination[] | undefined;
}

export default function CuratedDestinations({
  destinations,
}: CuratedDestinationsProps) {
  return (
    <section
      id={"curateddestinations"}
      className="mt-10 md:mt-16 border-t border-outline"
    >
      {destinations && (
        <div className="mx-auto max-w-(--container-max-w) px-6 md:px-10 mt-8 md:mt-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-8 md:mb-16">
            <div className="flex flex-col gap-4">
              <span className="text-headline-lg text-text">
                Curated Destinations
              </span>
              <span className="text-text-muted max-w-md">
                Our signature selection of locations where luxury meets untamed
                nature.
              </span>
            </div>
            <div className="self-start md:self-auto">
              <Button href="/destinations" variant="text">
                View all
              </Button>
            </div>
          </div>

          <div className="flex gap-6 md:gap-20 overflow-x-auto pb-10 no-scrollbar">
            {destinations.slice(0, 5).map((destination, index) => {
              const className = index % 2 !== 0 ? "pt-12" : "";
              return (
                <div key={index} className={className}>
                  <DestinationCard
                    href={`/destinations/${destination.slug}`}
                    className={"w-60 md:w-80"}
                    key={destination.id}
                    imagePath={destination.imagePath}
                    title={destination.title}
                    destinationCities={destination.destinationCities}
                    content={destination.content}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
