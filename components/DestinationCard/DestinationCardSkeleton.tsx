// Loading placeholder for DestinationCard — matches its aspect ratio, radius + layout.

import { cn } from "@/lib/utils";

interface DestinationCardSkeletonProps {
  className?: string;
}

export function DestinationCardSkeleton({
  className = "",
}: DestinationCardSkeletonProps) {
  return (
    <div
      className={cn(
        "relative aspect-3/4 overflow-hidden rounded-3xl bg-surface-high animate-pulse",
        className,
      )}
    >
      <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col gap-3">
        <div className="h-5 w-20 rounded-full bg-surface-highest" />
        <div className="h-6 w-3/4 rounded bg-surface-highest" />
        <div className="h-4 w-full rounded bg-surface-highest" />
      </div>
    </div>
  );
}

export default DestinationCardSkeleton;
