"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, MapPin, ChevronLeft, ChevronRight, Compass } from "lucide-react";
import type { Review } from "@/app/types/api";
import { formatMonth } from "@/lib/constants";
import Button from "@/components/Button/Button";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const isLong = quote.length > QUOTE_CLAMP_THRESHOLD;
  const hasImages = imagePaths.length > 0;
  const totalImages = imagePaths.length;

  return (
    <div
      className={`flex flex-col glass rounded-2xl overflow-hidden shadow-lg shadow-primary/20 max-w-sm w-full ${className}`}
    >
      {/* ── Cards WITH images: carousel + author overlay ── */}
      {hasImages ? (
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
          {/* Images */}
          {imagePaths.map((src, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-500 ${
                i === activeIndex ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <Image
                src={`/api/reviews/images?path=${encodeURIComponent(src)}`}
                alt={`${authorName}'s trip photo ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 384px"
                className="object-cover"
              />
            </div>
          ))}

          {/* Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          {/* Prev / Next arrows — only when multiple images */}
          {totalImages > 1 && (
            <>
              <Button
                variant="overlay"
                size="xs"
                onClick={() => setActiveIndex((i) => (i - 1 + totalImages) % totalImages)}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 -translate-y-1/2"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="overlay"
                size="xs"
                onClick={() => setActiveIndex((i) => (i + 1) % totalImages)}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Dot indicators — visual only, not interactive */}
          {totalImages > 1 && (
            <div className="absolute top-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
              {imagePaths.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-4 h-1.5 bg-white"
                      : "w-1.5 h-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Author overlaid at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-white/30 backdrop-blur-sm flex items-center justify-center shrink-0">
              <span className="text-label-sm font-bold text-white">
                {getInitials(authorName)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-body-md font-semibold text-white leading-tight truncate">
                {authorName}
              </p>
              {authorProfession && (
                <p className="text-label-sm text-white/70">{authorProfession}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ── Cards WITHOUT images: gradient placeholder ── */
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary-dark">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/5" />

          {/* Centred content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6">
            <Compass className="w-10 h-10 text-white/30" />
            <p className="text-headline-sm text-white/90 text-center font-semibold leading-snug">
              {packageTitle}
            </p>
            <p className="text-label-sm text-white/50">{formatMonth(travelDate)}</p>
          </div>

          {/* Bottom scrim — same as image cards */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Author overlay — identical structure to image cards */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-white/30 backdrop-blur-sm flex items-center justify-center shrink-0">
              <span className="text-label-sm font-bold text-white">
                {getInitials(authorName)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-body-md font-semibold text-white leading-tight truncate">
                {authorName}
              </p>
              {authorProfession && (
                <p className="text-label-sm text-white/70">{authorProfession}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Content area ── */}
      <div className="flex flex-col gap-3 p-5">
        {/* Stars */}
        <div className="flex items-center gap-0.5">
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
          className={`text-body-md text-text-muted leading-relaxed ${
            !expanded && isLong ? "line-clamp-4" : ""
          }`}
        >
          &ldquo;{quote}&rdquo;
        </p>
        {isLong && (
          <Button
            variant="text"
            size="xs"
            onClick={() => setExpanded((prev) => !prev)}
            className="-mt-1 text-left"
          >
            {expanded ? "View less" : "View more"}
          </Button>
        )}

        {/* Location pill */}
        <div className="flex items-center gap-1.5 bg-primary/10 rounded-full px-3 py-1.5 self-start mt-auto pt-2">
          <MapPin className="w-3 h-3 text-primary shrink-0" />
          <span className="text-label-sm text-primary truncate">
            {packageTitle} &middot; {formatMonth(travelDate)}
          </span>
        </div>
      </div>
    </div>
  );
}
