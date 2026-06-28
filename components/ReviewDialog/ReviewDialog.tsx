"use client";

import Image from "next/image";
import { Star, MapPin, X } from "lucide-react";
import { formatMonth } from "@/lib/constants";
import Dialog from "@/components/Dialog/Dialog";
import Button from "@/components/Button/Button";

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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
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
          <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
            <span className="text-label-sm font-bold text-primary">
              {getInitials(authorName)}
            </span>
          </div>
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
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? "fill-primary text-primary" : "text-text-subtle"}`}
          />
        ))}
      </div>

      {/* Images — horizontal scroll strip */}
      {imagePaths.length > 0 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-8 px-8">
          {imagePaths.map((src, i) => (
            <div key={i} className="relative w-36 h-24 rounded-xl overflow-hidden shrink-0">
              <Image
                src={src}
                alt={`Trip photo ${i + 1}`}
                fill
                sizes="144px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Full quote */}
      <p className="text-body-md text-text-muted leading-relaxed">
        &ldquo;{quote}&rdquo;
      </p>

      {/* Location pill */}
      <div className="flex items-center gap-1.5 bg-primary/10 rounded-full px-3 py-1.5 self-start">
        <MapPin className="w-3 h-3 text-primary shrink-0" />
        <span className="text-label-sm text-primary truncate">
          {packageTitle} &middot; {formatMonth(travelDate)}
        </span>
      </div>
    </Dialog>
  );
}
