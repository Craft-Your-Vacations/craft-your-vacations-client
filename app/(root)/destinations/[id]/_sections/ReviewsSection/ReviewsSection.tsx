import TravellerVoices from "@/components/TravellerVoices/TravellerVoices";
import type { Review } from "@/app/types/api";

interface ReviewsSectionProps {
  reviews: Review[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <TravellerVoices
      id="reviews"
      reviews={reviews}
      eyebrow="What they say"
      title="Voices from"
      titleAccent="This Destination"
      description="Real experiences from travellers who have already been where you're headed."
    />
  );
}
