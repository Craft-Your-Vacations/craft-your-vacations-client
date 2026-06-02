"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import type { Review } from "@/app/types/api";
import { formatMonth } from "@/lib/constants";

const QUOTE_CLAMP_THRESHOLD = 160;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface ReviewCardProps extends Review {
  className?: string;
}

export default function ReviewCard({
  rating,
  quote,
  authorName,
  authorProfession,
  packageTitle,
  travelDate,
  imagePaths,
  className = "",
}: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = quote.length > QUOTE_CLAMP_THRESHOLD;

  return (
    <div
      className={`relative flex flex-col gap-4 glass rounded-2xl p-6 overflow-hidden shadow-lg shadow-primary/20 max-w-sm w-full ${className}`}
    >
      {/* Decorative opening quote — large serif character as a subtle watermark */}
      <span
        className="absolute top-0 left-3 text-[96px] leading-none font-serif text-primary/[0.08] pointer-events-none select-none"
        aria-hidden="true"
      >
        &ldquo;
      </span>

      {/* Star rating */}
      <div className="flex items-center gap-1 relative z-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "fill-primary text-primary" : "text-text-subtle"
            }`}
          />
        ))}
      </div>

      {/* Quote */}
      <p
        className={`text-body-lg text-text-muted relative z-10 leading-relaxed ${
          !expanded && isLong ? "line-clamp-4" : ""
        }`}
      >
        &ldquo;{quote}&rdquo;
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="text-label-sm text-primary hover:text-primary-dark transition-colors relative z-10 -mt-1 text-left"
        >
          {expanded ? "View less" : "View more"}
        </button>
      )}

      {/* Trip tag */}
      <div className="flex items-center gap-1.5 text-label-sm text-primary/70 relative z-10">
        <MapPin className="w-3 h-3 shrink-0" />
        <span className="truncate">
          {packageTitle} &middot; {formatMonth(travelDate)}
        </span>
      </div>

      {/* Optional image thumbnails */}
      {imagePaths.length > 0 && (
        <div className="flex gap-2 relative z-10">
          {imagePaths.slice(0, 3).map((src, i) => (
            <div
              key={i}
              className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0"
            >
              <Image
                src={`/api/reviews/images?path=${encodeURIComponent(src)}`}
                alt={`Trip photo ${i + 1}`}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-outline relative z-10">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
          <span className="text-label-sm font-semibold text-primary">
            {getInitials(authorName)}
          </span>
        </div>
        <div>
          <p className="text-body-md text-text font-semibold">{authorName}</p>
          {authorProfession && (
            <p className="text-body-sm text-text-muted">{authorProfession}</p>
          )}
        </div>
      </div>
    </div>
  );
}
