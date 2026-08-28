"use client";
import { useState, useEffect } from "react";
import CtaBanner from "@/components/CtaBanner/CtaBanner";
import { useDestinations } from "@/hooks/useDestinations";
import { useApprovedReviews } from "@/hooks/useApprovedReviews";
import HeroSection from "./_sections/HeroSection/HeroSection";
import WhoWeAre from "./_sections/WhoWeAre/WhoWeAre";
import CuratedDestinations from "./_sections/CuratedDestinations/CuratedDestinations";
import Testimonials from "./_sections/Testimonials/Testimonials";

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
      <HeroSection destinations={data} />
      <WhoWeAre />
      <CuratedDestinations destinations={data} />
      <Testimonials reviews={reviews} visibleCount={sliderVisibleCount} />
      <CtaBanner
        heading="Plan an Unforgettable Experience Today!"
        subtext="We can help you fit your stay and experience within your allotted budget."
      />
    </div>
  );
}
