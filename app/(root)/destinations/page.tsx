"use client";
import ErrorState from "@/components/ErrorState/ErrorState";
import EmptyState from "@/components/EmptyState/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import CtaBanner from "@/components/CtaBanner/CtaBanner";
import { useDestinations } from "@/hooks/useDestinations";
import { MapPin } from "lucide-react";
import DestinationsHeader from "./_sections/DestinationsHeader/DestinationsHeader";
import DestinationsList from "./_sections/DestinationsList/DestinationsList";

export default function DestinationsPage() {
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
      <div
        id="destinations"
        className="pt-(--section-gap) mx-auto max-w-(--container-max-w) px-6 md:px-10"
      >
        <DestinationsHeader />
        <DestinationsList destinations={data} />
      </div>

      <CtaBanner
        heading="Your Dream Destination Awaits!"
        subtext="Let us help you plan every detail of your perfect getaway."
      />
    </div>
  );
}
