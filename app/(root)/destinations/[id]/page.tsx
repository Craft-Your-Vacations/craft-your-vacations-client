"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import { Package, Clock, ScrollText, Quote, MapPin } from "lucide-react";
import { useDestination } from "@/hooks/useDestination";
import { useDestinations } from "@/hooks/useDestinations";
import { useDestinationReviews } from "@/hooks/useDestinationReviews";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorState from "@/components/ErrorState/ErrorState";
import Section from "@/components/Section/Sections";
import PackageCard from "@/components/PackageCard/PackageCard";
import DestinationCard from "@/components/DestinationCard/DestinationCard";
import DestinationLandscapeCard from "@/components/DestinationLandscapeCard/DestinationLandscapeCard";
import ReviewCard from "@/components/ReviewCard/ReviewCard";
import AutoSlider from "@/components/AutoSlider/AutoSlider";
import PageHero from "@/components/PageHero/PageHero";
import CtaBanner from "@/components/CtaBanner/CtaBanner";
import { useRouter } from "next/navigation";
import UnsplashPhotoSlider from "@/components/UnsplashPhotoSlider/UnsplashPhotoSlider";
import { useUnsplashPhotos } from "@/hooks/useUnsplashPhotos";

export default function DestinationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError, error, refetch } = useDestination(id);
  const { data: allDestinations } = useDestinations();
  const { data: reviews = [] } = useDestinationReviews(id);
  const router = useRouter();

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

  const { title, imagePath, content, packages, destinationCities } = data;

  const popularDestinations =
    allDestinations?.filter((d) => d.slug !== id).slice(0, 4) ?? [];

  return (
    <div className="pt-(--section-gap)">
      {/* Hero */}
      <PageHero
        imagePath={imagePath}
        imageAlt={title}
        title={title}
        tags={destinationCities}
        chips={[
          {
            icon: <Package className="w-4 h-4" />,
            label: `${packages.length} Packages`,
          },
          {
            icon: <Clock className="w-4 h-4" />,
            label: `${Math.min(...packages.map((p) => p.days))}–${Math.max(...packages.map((p) => p.days))} Days`,
          },
        ]}
        onBack={() => router.back()}
      />

      {/* Info */}
      <Section id="destination-info" title="">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Content */}
          <div className="lg:col-span-2">
            <h2 className="text-headline-lg text-text mb-4">
              About this destination
            </h2>
            <p className="text-body-lg text-text-muted leading-relaxed">
              {content}
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex flex-col gap-4">
            <div className="glass rounded-2xl p-6 flex flex-col gap-5">
              <h3 className="text-headline-sm text-text">At a glance</h3>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-label-sm text-text-muted uppercase tracking-widest mb-0.5">
                    Cities
                  </p>
                  <p className="text-body-md text-text">
                    {destinationCities.join(", ")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-label-sm text-text-muted uppercase tracking-widest mb-0.5">
                    Packages
                  </p>
                  <p className="text-body-md text-text">
                    {packages.length} available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Unsplash Photo Gallery */}
      {unsplashPhotos.length > 0 && (
        <Section id="photo-gallery" title="">
          <div className="mb-8">
            <h2 className="text-headline-lg text-text">Explore {title}</h2>
            <p className="text-body-md text-text-muted mt-1">
              A glimpse of what awaits you
            </p>
          </div>
          <UnsplashPhotoSlider
            photos={unsplashPhotos}
            visibleCount={photoSliderCount}
          />
        </Section>
      )}

      {/* Packages */}
      {packages.length > 0 && (
        <Section id="packages" title="">
          <div className="mb-8">
            <h2 className="text-headline-lg text-text">Available packages</h2>
            <p className="text-body-md text-text-muted mt-1">
              Choose the journey that fits your style
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <PackageCard
                key={pkg.key}
                title={pkg.title}
                duration={`${pkg.days} Days`}
                href={`/destinations/${id}/packages/${pkg.key}`}
                features={[
                  {
                    icon: <Clock className="w-4 h-4" />,
                    text: `${pkg.days}-day itinerary`,
                  },
                  {
                    icon: <ScrollText className="w-4 h-4" />,
                    text: pkg.excerpt,
                  },
                ]}
                highlighted={index === Math.floor(packages.length / 2)}
              />
            ))}
          </div>
        </Section>
      )}

      {/* What Our Guests Say */}
      {reviews.length > 0 && (
        <Section id="reviews" title="">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <Quote className="w-5 h-5 text-primary" strokeWidth={1.5} />
              <h2 className="text-headline-lg text-text">
                Voices of Our Travellers
              </h2>
            </div>
            <p className="text-body-md text-text-muted">
              Real experiences from people who crafted their journey here
            </p>
          </div>
          <AutoSlider
            visibleCount={reviewSliderCount}
            intervalMs={4000}
          >
            {reviews.map((review) => (
              <ReviewCard key={review.id} {...review} />
            ))}
          </AutoSlider>
        </Section>
      )}

      {/* Memories From Our Customers */}
      {(() => {
        const memories = reviews.flatMap((r) => r.imagePaths);
        if (memories.length === 0) return null;
        return (
          <Section id="memories" title="">
            <div className="mb-8">
              <h2 className="text-headline-lg text-text">
                Memories From Our Customers
              </h2>
              <p className="text-body-md text-text-muted mt-1">
                Moments captured by fellow travellers
              </p>
            </div>
            <AutoSlider
              visibleCount={memoriesSliderCount}
              intervalMs={3000}
            >
              {memories.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-2xl overflow-hidden"
                >
                  <Image
                    src={`/api/reviews/images?path=${encodeURIComponent(src)}`}
                    alt={`Customer memory ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </AutoSlider>
          </Section>
        );
      })()}

      {/* Popular Destinations */}
      {popularDestinations.length > 0 && (
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
            {popularDestinations.map((destination) => (
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
            {popularDestinations.map((destination, index) => (
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
      )}

      <CtaBanner
        subtext="We can help you craft the perfect itinerary within your budget."
      />
    </div>
  );
}
