import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  className?: string;
  /** Star glyph size — defaults to w-4 h-4. */
  starClassName?: string;
}

// Read-only star rating row — the single source of truth for displaying a rating.
// (Interactive rating selection lives in ReviewModal, which owns its hover state.)
export function StarRating({
  rating,
  max = 5,
  className = "",
  starClassName = "w-4 h-4",
}: StarRatingProps) {
  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="img"
      aria-label={`Rated ${rating} out of ${max}`}
    >
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn(
            starClassName,
            i < rating ? "fill-primary text-primary" : "text-text-subtle",
          )}
        />
      ))}
    </div>
  );
}

export default StarRating;
