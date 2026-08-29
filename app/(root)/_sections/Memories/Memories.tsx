import TravellerMemories from "@/components/TravellerMemories/TravellerMemories";
import type { Review } from "@/app/types/api";

interface MemoriesProps {
  reviews: Review[];
}

export default function Memories({ reviews }: MemoriesProps) {
  return (
    <TravellerMemories
      id="memories"
      reviews={reviews}
      title="Memories from our travellers"
      description="Moments captured on trips across every destination we craft"
    />
  );
}
