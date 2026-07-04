"use client";
import Button from "@/components/Button/Button";
import {
  Compass,
  PenLine,
  Plane,
  Quote,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import IntroIcon1 from "@/public/introImage1.jpg";
import IntroIcon2 from "@/public/introImage2.jpg";
import CtaBanner from "@/components/CtaBanner/CtaBanner";
import DestinationCard from "@/components/DestinationCard/DestinationCard";
import ReviewCard from "@/components/ReviewCard/ReviewCard";
import AutoSlider from "@/components/AutoSlider/AutoSlider";
import { useDestinations } from "@/hooks/useDestinations";
import { useApprovedReviews } from "@/hooks/useApprovedReviews";

export default function HomePage() {
  const { data } = useDestinations();
  const { data: reviews = [] } = useApprovedReviews();

  const [sliderVisibleCount, setSliderVisibleCount] = useState(1);

  useEffect(() => {
    const update = () => {
      if (reviews.length === 1) {
        setSliderVisibleCount(1);
        return;
      }
      const w = window.innerWidth;
      setSliderVisibleCount(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [reviews.length]);

  return (
    <div className="no-scrollbar overflow-y-auto">
      <section className="relative min-h-[60vh] md:min-h-[75vh] lg:h-230.25 pt-20 md:pt-0 flex items-center overflow-hidden bg-surface-low">
        <div className="mx-auto max-w-(--container-max-w) px-6 md:px-10 w-full">
          <div className="z-10 lg:w-1/2">
            <span className="label text-primary font-bold tracking-[0.2em] mb-6 block uppercase text-label-sm">
              Elevate Your Perspective
            </span>
            <h1 className="text-display-lg md:text-display-xl lg:text-display-xxl text-text tracking-tighter leading-[0.9] mb-8">
              Explore the <br />
              <span className="text-stroke-primary italic inline-block px-1 py-1">
                Extraordinary
              </span>
            </h1>
            <p className="text-text-muted text-body-lg md:text-xl max-w-xl mb-6 md:mb-10 leading-relaxed font-light">
              Bespoke journeys curated for the discerning traveler. From the
              silence of Nordic fjords to the vibrant pulse of tropical
              archipelagos.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/destinations">Begin Your Story</Button>
            </div>
          </div>
          <div className="absolute right-[-5%] top-[10%] w-1/2 h-[80%] z-0 hidden lg:block">
            <div className="relative w-full h-full">
              <div className="absolute top-0 right-0 w-4/5 h-[85%] rounded-3xl overflow-hidden shadow-2xl z-20">
                <Image
                  src={IntroIcon1}
                  fill
                  objectFit="cover"
                  sizes="40vw"
                  alt="Intro icon"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-3/5 h-[50%] rounded-3xl overflow-hidden shadow-2xl z-30 border-8 border-white">
                <Image src={IntroIcon2} alt="Intro icon" fill={true} sizes="30vw" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* About Us */}
      <section id="about" className="mt-10 md:mt-16">
        <div className="mx-auto max-w-(--container-max-w) px-6 md:px-10">
          {/* Top block */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-12 mb-16">
            {/* Left — text */}
            <div className="flex-1 flex flex-col gap-6">
              <span className="text-label-sm text-primary uppercase tracking-[0.2em]">
                Who We Are
              </span>
              <h2 className="text-display-sm text-text tracking-tighter leading-tight">
                Travel on{" "}
                <span className="text-primary italic">your terms</span>
              </h2>
              <p className="text-body-lg text-text-muted max-w-lg leading-relaxed font-light">
                We&apos;re not a travel agency — we&apos;re your planning
                partner. At CraftYourVacations, we believe the best journeys are
                the ones you design yourself. We give you the destinations, the
                insights, and the structure. You bring the curiosity. No rigid
                packages, no cookie-cutter schedules — just your story, told
                your way.
              </p>
            </div>

            {/* Right — stats */}
            <div className="grid grid-cols-3 gap-4 lg:flex lg:flex-col lg:gap-6 lg:items-end">
              {[
                { value: "50+", label: "Destinations" },
                { value: "10k+", label: "Itineraries crafted" },
                { value: "100%", label: "Your design" },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-1 lg:text-right">
                  <span className="text-display-sm text-primary font-bold tracking-tighter">
                    {value}
                  </span>
                  <span className="text-label-md text-text-subtle">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Three pillar cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Compass,
                title: "Dream It",
                body: "Tell us where your curiosity leads. We surface destinations that match your pace, your taste, and your sense of wonder.",
              },
              {
                icon: PenLine,
                title: "Craft It",
                body: "Build your itinerary day by day. Every stay, every experience, every detour — yours to shape exactly as you imagine.",
              },
              {
                icon: Plane,
                title: "Live It",
                body: "Set off with confidence. Every detail planned, every moment yours to own. No surprises unless you want them.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="glass ghost-border rounded-3xl p-8 flex flex-col gap-4 shadow-lg shadow-primary/20"
              >
                <Icon className="w-7 h-7 text-primary-app" strokeWidth={1.5} />
                <h3 className="text-headline-md text-text">{title}</h3>
                <p className="text-body-sm text-text-muted leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        id={"curateddestinations"}
        className="mt-10 md:mt-16 border-t border-outline"
      >
        {data && (
          <div className="mx-auto max-w-(--container-max-w) px-6 md:px-10 mt-8 md:mt-16">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-8 md:mb-16">
              <div className="flex flex-col gap-4">
                <span className="text-headline-lg text-text">
                  Curated Destinations
                </span>
                <span className="text-text-muted max-w-md">
                  Our signature selection of locations where luxury meets
                  untamed nature.
                </span>
              </div>
              <div className="self-start md:self-auto">
                <Button href="/destinations" variant="text">
                  View all
                </Button>
              </div>
            </div>

            <div className="flex gap-6 md:gap-20 overflow-x-auto pb-10 no-scrollbar">
              {data.slice(0, 5).map((destination, index) => {
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

      {/*Voices of Our Travellers*/}
      {reviews.length > 0 && (
        <section
          id="testimonials"
          className="mt-10 md:mt-16 border-t border-outline"
        >
          <div className="mx-auto max-w-(--container-max-w) px-6 md:px-10 mt-8 md:mt-16">
            <div className="flex flex-row items-center justify-between mb-6 md:mb-12">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Quote className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  <span className="text-headline-lg text-text">
                    Voices of Our Travellers
                  </span>
                </div>
                <span className="text-text-muted max-w-md">
                  Stories from people who crafted their journey with us.
                </span>
              </div>
            </div>
            <AutoSlider visibleCount={sliderVisibleCount} intervalMs={4500}>
              {reviews.slice(0, 6).map((review) => (
                <ReviewCard key={review.id} {...review} />
              ))}
            </AutoSlider>
          </div>
        </section>
      )}

      <CtaBanner
        heading="Plan an Unforgettable Experience Today!"
        subtext="We can help you fit your stay and experience within your allotted budget."
      />
    </div>
  );
}
