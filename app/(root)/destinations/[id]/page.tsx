"use client";

import { use, useState, useEffect } from "react";
import { useDestination } from "@/hooks/useDestination";
import { useDestinations } from "@/hooks/useDestinations";
import { useDestinationReviews } from "@/hooks/useDestinationReviews";
import { useUnsplashPhotos } from "@/hooks/useUnsplashPhotos";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorState from "@/components/ErrorState/ErrorState";
import CtaBanner from "@/components/CtaBanner/CtaBanner";
import DestinationHero from "./_sections/DestinationHero/DestinationHero";
import DestinationOverview from "./_sections/DestinationOverview/DestinationOverview";
import PhotoGallery from "./_sections/PhotoGallery/PhotoGallery";
import PackagesGrid from "./_sections/PackagesGrid/PackagesGrid";
import ReviewsSection from "./_sections/ReviewsSection/ReviewsSection";
import MemoriesSection from "./_sections/MemoriesSection/MemoriesSection";
import PopularDestinations from "./_sections/PopularDestinations/PopularDestinations";

export default function DestinationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError, error, refetch } = useDestination(id);
  const { data: allDestinations } = useDestinations();
  const { data: reviews = [] } = useDestinationReviews(id);

  const { data: unsplashPhotos = [] } = useUnsplashPhotos(id);

  const [reviewSliderCount, setReviewSliderCount] = useState(1);
  const [memoriesSliderCount, setMemoriesSliderCount] = useState(1);
  const [photoSliderCount, setPhotoSliderCount] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setReviewSliderCount(reviews.length === 1 ? 1 : w >= 1024 ? 3 : w >= 640 ? 2 : 1);
      setMemoriesSliderCount(w >= 1024 ? 4 : w >= 640 ? 2 : 1);
      setPhotoSliderCount(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [reviews.length]);

  if (isLoading) {
    return (
      <LoadingSpinner message="Loading destination..." fullScreen={false} />
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

  if (!data) {
    return <ErrorState title="Destination not found" />;
  }

  const popularDestinations =
    allDestinations?.filter((d) => d.slug !== id).slice(0, 4) ?? [];

  return (
    <div className="pt-(--section-gap)">
      <DestinationHero destination={data} />
      <DestinationOverview destination={data} />
      <PhotoGallery
        title={data.title}
        photos={unsplashPhotos}
        visibleCount={photoSliderCount}
      />
      <PackagesGrid destinationId={id} packages={data.packages} />
      <ReviewsSection reviews={reviews} visibleCount={reviewSliderCount} />
      <MemoriesSection reviews={reviews} visibleCount={memoriesSliderCount} />
      <PopularDestinations destinations={popularDestinations} />
      <CtaBanner subtext="We can help you craft the perfect itinerary within your budget." />
    </div>
  );
}
