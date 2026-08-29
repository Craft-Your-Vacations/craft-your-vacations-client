"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, SearchX } from "lucide-react";
import ErrorState from "@/components/ErrorState/ErrorState";
import EmptyState from "@/components/EmptyState/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import CtaBanner from "@/components/CtaBanner/CtaBanner";
import Button from "@/components/Button/Button";
import { useDestinations } from "@/hooks/useDestinations";
import DestinationsHero from "./_sections/DestinationsHero/DestinationsHero";
import DestinationsToolbar, {
  type DestinationFilter,
} from "./_sections/DestinationsToolbar/DestinationsToolbar";
import DestinationsShowcase from "@/components/DestinationsShowcase/DestinationsShowcase";

function matchesQuery(
  destination: { title: string; content: string; destinationCities: string[] },
  needle: string,
) {
  return [
    destination.title,
    destination.content,
    ...destination.destinationCities,
  ].some((field) => field.toLowerCase().includes(needle));
}

function DestinationsPageContent() {
  const { data, isLoading, isError, error, refetch } = useDestinations();

  // The home hero's search box routes here as /destinations?q=… — seed the
  // field from it so the query the visitor typed is already applied.
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [filter, setFilter] = useState<DestinationFilter>("all");

  const destinations = useMemo(() => data ?? [], [data]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return destinations
      .filter((d) => (filter === "featured" ? d.isFeatured : true))
      .filter((d) => (needle ? matchesQuery(d, needle) : true));
  }, [destinations, query, filter]);

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

  if (destinations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-6">
        <EmptyState
          icon={<MapPin className="w-10 h-10 text-primary/50" strokeWidth={1.5} />}
          title="No destinations yet"
          description="New journeys are added regularly — check back soon."
          className="w-full max-w-sm"
        />
      </div>
    );
  }

  return (
    <div>
      <DestinationsHero destinations={destinations} />

      <DestinationsToolbar
        query={query}
        onQueryChange={setQuery}
        filter={filter}
        onFilterChange={setFilter}
        resultCount={visible.length}
        totalCount={destinations.length}
      />

      <div className="mx-auto max-w-(--container-max-w) px-6 md:px-10 pt-10 md:pt-14">
        {visible.length === 0 ? (
          <EmptyState
            icon={<SearchX className="w-10 h-10 text-primary/50" strokeWidth={1.5} />}
            title="No destinations match your search"
            description="Try a different place or city, or clear the filters to see everything."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
              >
                Clear filters
              </Button>
            }
            className="mx-auto w-full max-w-md"
          />
        ) : (
          <DestinationsShowcase destinations={visible} />
        )}
      </div>

      <CtaBanner
        heading="Your Dream Destination Awaits!"
        subtext="Let us help you plan every detail of your perfect getaway."
      />
    </div>
  );
}

// useSearchParams needs a Suspense boundary so the route can still be
// prerendered (see app/(auth)/verify-email/page.tsx for the same pattern).
export default function DestinationsPage() {
  return (
    <Suspense
      fallback={
        <LoadingSpinner message="Loading destinations..." fullScreen={false} />
      }
    >
      <DestinationsPageContent />
    </Suspense>
  );
}
