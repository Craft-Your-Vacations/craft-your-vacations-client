import React from "react";
import { cn } from "@/lib/utils";

type ChipVariant = "onImage" | "onSurface" | "warning";

interface ChipProps {
  children: React.ReactNode;
  /** Optional leading icon — inherits the chip's text color; size it ~w-3 h-3. */
  icon?: React.ReactNode;
  /**
   * - onImage  : cyan glass, for pills sitting over photography (hero / card overlays)
   * - onSurface: primary tint, for pills on theme-adaptive card / surface backgrounds
   * - warning  : amber tint, for "needs your attention" pills (semantic token, not raw palette)
   */
  variant?: ChipVariant;
  className?: string;
}

// Small rounded-full label pill with an optional leading icon. The single source
// of truth for the location/meta pills used across cards, heroes and reviews.
const variantClasses: Record<ChipVariant, string> = {
  onImage:
    "bg-primary/20 border border-primary/35 text-primary-app backdrop-blur-sm",
  onSurface: "bg-primary/10 text-primary",
  warning: "bg-warning/10 text-warning",
};

export function Chip({
  children,
  icon,
  variant = "onImage",
  className = "",
}: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1 text-label-sm",
        variantClasses[variant],
        className,
      )}
    >
      {icon && <span className="flex shrink-0 items-center">{icon}</span>}
      <span className="truncate">{children}</span>
    </span>
  );
}

export default Chip;
