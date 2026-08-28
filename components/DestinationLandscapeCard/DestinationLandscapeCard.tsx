"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { DestinationCardData } from "@/app/types/component";

interface DestinationLandscapeCardProps extends DestinationCardData {
  /** Which side the floating glass detail panel sits on (desktop). */
  panelLeft?: boolean;
}

export function DestinationLandscapeCard({
  imagePath,
  destinationCities,
  title,
  content,
  href,
  panelLeft = true,
}: DestinationLandscapeCardProps) {
  const cities = destinationCities.slice(0, 3).join(" · ");

  const card = (
    // Height tracks the image via aspect-video so wide landscape photos sit well.
    <div className="group relative aspect-video overflow-hidden rounded-3xl cursor-pointer shadow-lg shadow-primary/20 transition-transform duration-300 ease-out hover:-translate-y-1.5">
      {/* Full-bleed image */}
      <Image
        src={imagePath}
        alt={title}
        fill
        sizes="(min-width: 1024px) 66vw, 100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Directional dark vignette from the panel side */}
      <div
        className={`absolute inset-0 ${
          panelLeft
            ? "bg-linear-to-r from-black/70 via-black/30 to-transparent"
            : "bg-linear-to-l from-black/70 via-black/30 to-transparent"
        }`}
      />

      {/* Floating frosted-glass detail panel. Full-width bottom strip on mobile,
          a side panel on desktop (single md: breakpoint). */}
      <div
        className={`absolute left-4 right-4 bottom-4 flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-black/35 p-6 backdrop-blur-md md:top-6 md:bottom-6 md:w-1/3 md:p-8 ${
          panelLeft
            ? "md:left-6 md:right-auto"
            : "md:right-6 md:left-auto"
        }`}
      >
        <div className="flex flex-col gap-3 md:gap-4">
          {cities && (
            <span className="text-label-sm uppercase tracking-widest text-primary-app">
              {cities}
            </span>
          )}
          <h3 className="text-headline-lg leading-tight text-white">{title}</h3>
          <p className="text-body-sm leading-relaxed text-white/70 line-clamp-3 md:line-clamp-4">
            {content}
          </p>
        </div>
        <span className="mt-1 flex items-center gap-1.5 text-body-sm font-semibold text-primary-app">
          Explore destination
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {card}
      </Link>
    );
  }

  return card;
}

export default DestinationLandscapeCard;
