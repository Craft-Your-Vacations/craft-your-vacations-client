"use client";

import Image from "next/image";
import { MapPin, X } from "lucide-react";
import { formatMonth } from "@/lib/constants";
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
