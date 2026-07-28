import { Quote } from "lucide-react";
import Section from "@/components/Section/Sections";
import ReviewCard from "@/components/ReviewCard/ReviewCard";
import AutoSlider from "@/components/AutoSlider/AutoSlider";
import type { Review } from "@/app/types/api";

interface ReviewsSectionProps {
  reviews: Review[];
  visibleCount: number;
}

export default function ReviewsSection({
  reviews,
  visibleCount,
}: ReviewsSectionProps) {
  if (reviews.length === 0) return null;

  return (
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
      <AutoSlider visibleCount={visibleCount} intervalMs={4000}>
        {reviews.map((review) => (
          <ReviewCard key={review.id} {...review} />
        ))}
      </AutoSlider>
    </Section>
  );
}
