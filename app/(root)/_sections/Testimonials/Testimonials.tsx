import TravellerVoices from "@/components/TravellerVoices/TravellerVoices";
import type { Review } from "@/app/types/api";

interface TestimonialsProps {
  reviews: Review[];
}

export default function Testimonials({ reviews }: TestimonialsProps) {
  return (
    <TravellerVoices
      id="testimonials"
      reviews={reviews}
      eyebrow="What they say"
      title="Voices of"
      titleAccent="Our Travellers"
      description="Stories from people who crafted their journey with us — in their own words, with their own photographs."
    />
  );
}
