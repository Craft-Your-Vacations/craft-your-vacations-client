import TravellerMemories from "@/components/TravellerMemories/TravellerMemories";
import type { Review } from "@/app/types/api";

interface MemoriesSectionProps {
  reviews: Review[];
}

export default function MemoriesSection({ reviews }: MemoriesSectionProps) {
  return (
    <TravellerMemories
      id="memories"
      reviews={reviews}
      title="Memories from this destination"
      description="Moments captured by travellers who have already been"
    />
  );
}
