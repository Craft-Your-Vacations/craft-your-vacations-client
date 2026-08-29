"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, X, ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonth } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Dialog from "@/components/Dialog/Dialog";
import Button from "@/components/Button/Button";
import Chip from "@/components/Chip/Chip";
import Avatar from "@/components/Avatar/Avatar";
import StarRating from "@/components/StarRating/StarRating";

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  rating: number;
  quote: string;
  authorName: string;
  authorProfession?: string;
  packageTitle: string;
  travelDate: string;
  imagePaths: string[];
}

export default function ReviewDialog({
  isOpen,
  onClose,
  rating,
  quote,
  authorName,
  authorProfession,
  packageTitle,
  travelDate,
  imagePaths,
}: ReviewDialogProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = imagePaths.length;

  // Start from the first photo each time the dialog opens. Reconciled during
  // render rather than in an effect (see AGENTS.md).
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);
    if (!isOpen) setActiveIndex(0);
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={`Full review by ${authorName}`}
      size="lg"
      className="gap-5"
    >
      {/* Header — author + close */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar name={authorName} variant="onSurface" />
          <div className="min-w-0">
            <p className="text-body-md font-semibold text-text">{authorName}</p>
            {authorProfession && (
              <p className="text-body-sm text-text-muted">{authorProfession}</p>
            )}
          </div>
        </div>
        <Button
          variant="icon"
          size="xs"
          onClick={onClose}
          aria-label="Close"
          className="shrink-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Stars */}
      <StarRating rating={rating} />

      {/* Photos — one at a time, stepped with the chevrons. Sits inside the
          panel's own padding, so it keeps a gutter on both sides. */}
      {total > 0 && (
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-surface-high">
          {imagePaths.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={`${authorName}'s trip photo ${i + 1} of ${total}`}
              fill
              sizes="(max-width: 768px) 90vw, 448px"
              className={cn(
                "object-cover transition-opacity duration-300",
                i === activeIndex ? "opacity-100" : "opacity-0",
              )}
            />
          ))}

          {total > 1 && (
            <>
              <Button
                variant="overlay"
                size="sm"
                onClick={() => setActiveIndex((i) => (i - 1 + total) % total)}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 -translate-y-1/2"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="overlay"
                size="sm"
                onClick={() => setActiveIndex((i) => (i + 1) % total)}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>

              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5"
              >
                {imagePaths.map((src, i) => (
                  <span
                    key={src}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === activeIndex ? "w-4 bg-white" : "w-1.5 bg-white/50",
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Full quote */}
      <p className="text-body-md text-text-muted leading-relaxed">
        &ldquo;{quote}&rdquo;
      </p>

      {/* Location pill */}
      <Chip
        variant="onSurface"
        icon={<MapPin className="w-3 h-3" />}
        className="self-start"
      >
        {packageTitle} &middot; {formatMonth(travelDate)}
      </Chip>
    </Dialog>
  );
}
