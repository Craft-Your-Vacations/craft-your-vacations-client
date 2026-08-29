"use client";

import { useState } from "react";
import { MapPin, Images } from "lucide-react";
import type { Review } from "@/app/types/api";
import { formatMonth } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Button from "@/components/Button/Button";
import Chip from "@/components/Chip/Chip";
import Avatar from "@/components/Avatar/Avatar";
import StarRating from "@/components/StarRating/StarRating";
import ReviewDialog from "@/components/ReviewDialog/ReviewDialog";

const QUOTE_CLAMP_THRESHOLD = 240;

interface ReviewCardProps extends Review {
  className?: string;
}

/**
 * Quiet, text-first testimonial. `modal-panel` keeps the card white in light
 * theme and glass in dark, so it never drops a white block onto the near-black
 * page. The frosted plate it sits on belongs to the section, not to this card —
 * the plate stays put while the cards slide across it.
 *
 * Flat, per the Floating-Glass Rule: it sits inside that plate, so its own
 * border and the tonal step carry it. An ambient shadow here reads as a second
 * grey rectangle behind the card rather than as lift.
 *
 * Height is bounded at both ends — a floor so a one-line review doesn't look
 * collapsed, a ceiling so a long one can't run away. The quote is the elastic
 * part, so the author and the footer stay put whatever the length.
 */
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
  const [dialogOpen, setDialogOpen] = useState(false);

  const isLong = quote.length > QUOTE_CLAMP_THRESHOLD;
  const photoCount = imagePaths.length;

  // One link into the dialog, which carries the full quote and every photo.
  const actionLabel = isLong
    ? "Read full review"
    : photoCount > 0
      ? `View ${photoCount} photo${photoCount === 1 ? "" : "s"}`
      : null;

  return (
    <>
      <figure
        className={cn(
          "modal-panel flex h-full max-h-96 min-h-72 w-full flex-col gap-5 overflow-hidden rounded-2xl p-6 md:p-8",
          className,
        )}
      >
        {/* Author */}
        <div className="flex shrink-0 items-center gap-3">
          <Avatar name={authorName} variant="onSurface" />
          <div className="min-w-0">
            <p className="truncate text-body-md font-semibold leading-tight text-text">
              {authorName}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <StarRating rating={rating} />
              {authorProfession && (
                <span className="truncate text-label-sm text-text-subtle">
                  {authorProfession}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* The elastic middle — takes the slack, gives it back under pressure */}
        <blockquote className="min-h-0 flex-1 overflow-hidden">
          <p className="line-clamp-5 text-body-md leading-relaxed text-text-muted">
            &ldquo;{quote}&rdquo;
          </p>
        </blockquote>

        <figcaption className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <Chip
            variant="onSurface"
            icon={<MapPin className="h-3 w-3" />}
            className="min-w-0"
          >
            {packageTitle} &middot; {formatMonth(travelDate)}
          </Chip>

          {actionLabel && (
            <Button
              variant="text"
              size="xs"
              onClick={() => setDialogOpen(true)}
              className="shrink-0"
            >
              {photoCount > 0 && <Images className="h-4 w-4" />}
              {actionLabel}
            </Button>
          )}
        </figcaption>
      </figure>

      <ReviewDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        rating={rating}
        quote={quote}
        authorName={authorName}
        authorProfession={authorProfession}
        packageTitle={packageTitle}
        travelDate={travelDate}
        imagePaths={imagePaths}
      />
    </>
  );
}
