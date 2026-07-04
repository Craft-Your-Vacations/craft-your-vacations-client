"use client";
import DestinationCard from "@/components/DestinationCard/DestinationCard";
import DestinationLandscapeCard from "@/components/DestinationLandscapeCard/DestinationLandscapeCard";
import ErrorState from "@/components/ErrorState/ErrorState";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import CtaBanner from "@/components/CtaBanner/CtaBanner";
import { useDestinations } from "@/hooks/useDestinations";
import { MapPin } from "lucide-react";

export function DestinationsScreen() {
  const { data, isLoading, isError, error, refetch } = useDestinations();

  if (isLoading) {
    return (
      <LoadingSpinner message="Loading destinations..." fullScreen={false} />
    );
  }

  if (isError) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : undefined}
        onRetry={refetch}
      />
    );
  }

  if (!data || data.length === 0) {
    return <ErrorState title="No destinations found" />;
  }

  return (
    <div>
      <div id="destinations" className="pt-(--section-gap) mx-auto max-w-(--container-max-w) px-6 md:px-10">
        <div className="z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col items-center">
            <h1 className="text-display-lg md:text-display-xl lg:text-display-xxl text-text tracking-tighter leading-hero">
              The Curated
            </h1>
            <span className="text-display-lg md:text-display-xl lg:text-display-xxl tracking-tighter leading-hero mb-4 lg:mb-8 text-stroke-primary italic">
              Horizon
            </span>
          </div>
          <p className="text-text-muted text-body-lg md:text-xl max-w-xl mb-0 lg:mb-10 leading-relaxed font-light">
            Discover hand-picked journeys that bridge the gap between luxury and
            raw exploration. Your next story begins here.
          </p>
        </div>
        {/* Mobile: portrait grid */}
        <div className="lg:hidden grid grid-cols-1 gap-4 mt-6">
          {data.map((destination) => (
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
          {data.map((destination, index) => {
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

            const waypoint = (
              <div className="hidden lg:flex flex-col items-center justify-center gap-3 py-2">
                {/* Top route dot */}
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                {/* Line segment */}
                <div className="flex-1 w-0.5 bg-linear-to-b from-primary/20 via-primary/50 to-primary/70 rounded-full" />
                {/* Main pin */}
                <div className="relative flex-shrink-0">
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 rounded-full bg-primary/20 scale-150 blur-sm" />
                  <div className="relative w-11 h-11 rounded-full bg-primary/15 border-2 border-primary/60 shadow-lg shadow-primary/30 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" strokeWidth={2} />
                  </div>
                </div>
                {/* Line segment */}
                <div className="flex-1 w-0.5 bg-linear-to-t from-primary/20 via-primary/50 to-primary/70 rounded-full" />
                {/* Bottom route dot */}
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" />
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
                    {waypoint}
                  </>
                ) : (
                  <>
                    {waypoint}
                    {card}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <CtaBanner
        heading="Your Dream Destination Awaits!"
        subtext="Let us help you plan every detail of your perfect getaway."
      />
    </div>
  );
}

export default DestinationsScreen;
