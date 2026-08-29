"use client";
import CtaBanner from "@/components/CtaBanner/CtaBanner";
import { useDestinations } from "@/hooks/useDestinations";
import { useApprovedReviews } from "@/hooks/useApprovedReviews";
import HeroSection from "./_sections/HeroSection/HeroSection";
import WhoWeAre from "./_sections/WhoWeAre/WhoWeAre";
import CuratedDestinations from "./_sections/CuratedDestinations/CuratedDestinations";
import Testimonials from "./_sections/Testimonials/Testimonials";
import Memories from "./_sections/Memories/Memories";

export default function HomePage() {
  const { data } = useDestinations();
  const { data: reviews = [] } = useApprovedReviews();

  return (
    <div className="no-scrollbar overflow-y-auto">
      <HeroSection destinations={data} />
      <WhoWeAre />
      <CuratedDestinations destinations={data} />
      <Testimonials reviews={reviews} />
      <Memories reviews={reviews} />
      <CtaBanner
        heading="Plan an Unforgettable Experience Today!"
        subtext="We can help you fit your stay and experience within your allotted budget."
      />
    </div>
  );
}
