import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingVariant = "onSurface" | "onImage";

interface StarRatingProps {
  rating: number;
  max?: number;
  /**
   * - onSurface: theme primary, for ratings on cards / surfaces
   * - onImage  : theme-independent cyan, for ratings over photography
   */
  variant?: StarRatingVariant;
  className?: string;
  /** Star glyph size — defaults to w-4 h-4. */
  starClassName?: string;
}

const variantClasses: Record<StarRatingVariant, { on: string; off: string }> = {
  onSurface: { on: "fill-primary text-primary", off: "text-text-subtle" },
  onImage: { on: "fill-primary-app text-primary-app", off: "text-white/35" },
};

// Read-only star rating row — the single source of truth for displaying a rating.
// (Interactive rating selection lives in ReviewModal, which owns its hover state.)
export function StarRating({
  rating,
  max = 5,
  variant = "onSurface",
  className = "",
  starClassName = "w-4 h-4",
}: StarRatingProps) {
  const tone = variantClasses[variant];

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
            i < rating ? tone.on : tone.off,
          )}
        />
      ))}
    </div>
  );
}

export default StarRating;
