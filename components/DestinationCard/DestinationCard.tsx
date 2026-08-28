//Destination Card
"use client";

import React, { useState } from "react";
import type { DestinationCardData } from "@/app/types/component";
import Image from "next/image";
import Link from "next/link";
import { Compass, Star, MapPin, ArrowRight } from "lucide-react";
import Button from "@/components/Button/Button";
import Chip from "@/components/Chip/Chip";

interface DestinationCardProps extends DestinationCardData {
  className?: string;
}

// The footer's blur only fades in low down, so the subject stays sharp up top
// and just the bottom carries a soft colour-wash where the copy sits.
const FOOTER_MASK = "linear-gradient(to bottom, transparent, black 62%)";

export function DestinationCard({
  imagePath,
  destinationCities,
  title,
  content,
  href,
  isFeatured,
  className = "",
}: DestinationCardProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(imagePath) && !imgError;
  const cities = destinationCities.slice(0, 2);

  const cardContent = (
    // Hover lift uses transform only (GPU-composited).
    <div
      className={`group relative aspect-3/4 overflow-hidden rounded-3xl cursor-pointer shadow-lg shadow-primary/20 transition-transform duration-300 ease-out hover:-translate-y-2 ${className}`}
    >
      {/* Image or gradient fallback */}
      {showImage ? (
        <Image
          src={imagePath}
          alt={cities.length ? `${title} — ${cities.join(", ")}` : title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-linear-to-br from-primary via-primary-dark to-primary-dark px-6 text-center">
          <Compass className="h-10 w-10 text-white/30" />
          <span className="text-headline-sm font-semibold text-white/90">{title}</span>
        </div>
      )}

      {/* Featured badge */}
      {isFeatured && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-primary-app/30 bg-primary/25 px-3 py-1 text-label-sm text-primary-app backdrop-blur-sm">
          <Star className="h-3 w-3" />
          Featured
        </span>
      )}

      {/* Glass footer — clear image at the top, soft colour-wash at the bottom */}
      <div className="absolute inset-x-0 bottom-0 pt-10">
        <div
          aria-hidden
          className="absolute inset-0 backdrop-blur-sm"
          style={{ maskImage: FOOTER_MASK, WebkitMaskImage: FOOTER_MASK }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-black/90 via-black/45 to-transparent"
        />

        <div className="relative flex flex-col gap-2.5 p-5">
          <h3 className="text-headline-md leading-tight text-white">{title}</h3>
          <p className="text-body-sm leading-relaxed text-white/75 line-clamp-2">
            {content}
          </p>

          {cities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {cities.map((c) => (
                <Chip key={c} icon={<MapPin className="h-3 w-3" />}>
                  {c}
                </Chip>
              ))}
            </div>
          )}

          <Button variant="primary" render="span" className="mt-1 w-full">
            Explore
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

export default DestinationCard;
