"use client";

import Image from "next/image";
import AutoSlider from "@/components/AutoSlider/AutoSlider";
import { useVisibleCount } from "@/hooks/useVisibleCount";
import { formatMonth } from "@/lib/constants";
import type { Review } from "@/app/types/api";

interface TravellerMemoriesProps {
  reviews: Review[];
  /** Anchor id — each page gives its own. */
  id: string;
  title: string;
  description: string;
}

interface Memory {
  src: string;
  authorName: string;
  packageTitle: string;
  travelDate: string;
}

/** Photos are the point here, so cap the strip rather than paginate forever. */
const MAX_MEMORIES = 12;

function MemoryCard({ memory }: { memory: Memory }) {
  return (
    <div className="group relative aspect-video overflow-hidden rounded-2xl">
      <Image
        src={memory.src}
        alt={`Trip photo shared by ${memory.authorName}`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Caption slides up on hover, matching the Unsplash gallery's treatment */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-linear-to-t from-black/75 to-transparent px-4 py-3 transition-transform duration-300 group-hover:translate-y-0">
        <p className="truncate text-body-sm font-semibold text-white">
          {memory.authorName}
        </p>
        <p className="truncate text-label-sm text-white/70">
          {memory.packageTitle} &middot; {formatMonth(memory.travelDate)}
        </p>
      </div>
    </div>
  );
}

/**
 * Photographs travellers attached to their reviews, as a sliding strip. Shared
 * by the home page (every approved review) and a destination's own page (just
 * that destination's). Renders nothing when no review carries a photo.
 */
export default function TravellerMemories({
  reviews,
  id,
  title,
  description,
}: TravellerMemoriesProps) {
  const visibleCount = useVisibleCount({ base: 1, sm: 2, lg: 3 });

  const memories: Memory[] = reviews
    .flatMap((review) =>
      review.imagePaths.map((src) => ({
        src,
        authorName: review.authorName,
        packageTitle: review.packageTitle,
        travelDate: review.travelDate,
      })),
    )
    .slice(0, MAX_MEMORIES);

  if (memories.length === 0) return null;

  return (
    <section id={id} className="mt-10 border-t border-outline md:mt-16">
      <div className="mx-auto max-w-(--container-max-w) px-6 py-12 md:px-10 md:py-16">
        <div className="mb-8">
          <h2 className="text-headline-lg text-text">{title}</h2>
          <p className="text-body-md text-text-muted mt-1">{description}</p>
        </div>

        <AutoSlider visibleCount={visibleCount} intervalMs={3500}>
          {memories.map((memory) => (
            <MemoryCard key={memory.src} memory={memory} />
          ))}
        </AutoSlider>
      </div>
    </section>
  );
}
