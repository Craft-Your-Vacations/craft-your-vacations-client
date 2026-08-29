import Button from "@/components/Button/Button";
import DestinationSlider from "@/components/DestinationSlider/DestinationSlider";
import DestinationCardSkeleton from "@/components/DestinationCard/DestinationCardSkeleton";
import EmptyState from "@/components/EmptyState/EmptyState";
import Reveal from "@/components/motion/Reveal";
import { Compass, ArrowRight } from "lucide-react";
import type { Destination } from "@/app/types/api";

interface CuratedDestinationsProps {
  /** undefined while loading, [] when resolved-empty, otherwise the list. */
  destinations: Destination[] | undefined;
}

export default function CuratedDestinations({
  destinations,
}: CuratedDestinationsProps) {
  const isLoading = destinations === undefined;
  // Featured destinations lead the strip.
  const items = (destinations ?? [])
    .slice()
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
    .slice(0, 8);

  return (
    <section
      id="curateddestinations"
      className="mt-10 border-t border-outline md:mt-16"
    >
      <div className="mx-auto max-w-(--container-max-w) px-6 py-12 md:px-10 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          {/* Text — left. Same opener as WhoWeAre and TravellerVoices: tracked
              eyebrow, display-scale heading with one cyan italic accent line. */}
          <Reveal className="flex min-w-0 flex-col gap-6 lg:col-span-4">
            <span className="inline-flex items-center gap-3 text-label-md uppercase tracking-widest text-primary">
              Where to next
              <span aria-hidden="true" className="h-px w-10 bg-primary/50" />
            </span>

            <h2 className="text-display-sm md:text-display-md text-text tracking-tighter leading-tight">
              Curated
              <br />
              <span className="text-primary italic">Destinations</span>
            </h2>

            <p className="max-w-md text-body-lg font-light leading-relaxed text-text-muted">
              Our signature selection of locations where luxury meets untamed
              nature — handpicked and always in motion.
            </p>

            <Button href="/destinations" variant="secondary" className="self-start">
              Explore all
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Reveal>

          {/* Auto-sliding cards — right */}
          <div className="lg:col-span-8">
            {isLoading && (
              <div className="flex gap-6 overflow-hidden py-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <DestinationCardSkeleton key={i} className="w-64 shrink-0" />
                ))}
              </div>
            )}

            {!isLoading && items.length === 0 && (
              <EmptyState
                icon={<Compass className="h-8 w-8" />}
                title="No destinations yet"
                description="New signature destinations are on the way — check back soon."
              />
            )}

            {!isLoading && items.length > 0 && <DestinationSlider items={items} />}
          </div>
        </div>
      </div>
    </section>
  );
}
