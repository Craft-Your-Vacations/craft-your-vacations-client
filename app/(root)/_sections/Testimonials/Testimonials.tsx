import { Quote } from "lucide-react";
import AutoSlider from "@/components/AutoSlider/AutoSlider";
import ReviewCard from "@/components/ReviewCard/ReviewCard";
import type { Review } from "@/app/types/api";

interface TestimonialsProps {
  reviews: Review[];
  visibleCount: number;
}

export default function Testimonials({
  reviews,
  visibleCount,
}: TestimonialsProps) {
  if (reviews.length === 0) return null;

  return (
    <section id="testimonials" className="mt-10 md:mt-16 border-t border-outline">
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
        <AutoSlider visibleCount={visibleCount} intervalMs={4500}>
          {reviews.slice(0, 6).map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))}
        </AutoSlider>
      </div>
    </section>
  );
}
