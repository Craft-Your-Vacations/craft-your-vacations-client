"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { DestinationCardData } from "@/app/types/component";

interface DestinationLandscapeCardProps extends DestinationCardData {
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
  const card = (
    <div
      className="group relative overflow-hidden rounded-3xl h-96
        shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/20
        transition-shadow duration-500 cursor-pointer"
    >
      {/* Full-bleed image */}
      <Image
        src={imagePath}
        alt={title}
        fill
        sizes="100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Directional dark vignette from panel side */}
      <div
        className={`absolute inset-0 ${
          panelLeft
            ? "bg-linear-to-r from-black/70 via-black/30 to-transparent"
            : "bg-linear-to-l from-black/70 via-black/30 to-transparent"
        }`}
      />

      {/* Floating glass panel */}
      <div
        className={`absolute inset-y-6 w-[32%] bg-black/35 backdrop-blur-md border border-white/10 rounded-2xl p-8
          flex flex-col justify-between ${panelLeft ? "left-6" : "right-6"}`}
      >
        <div className="flex flex-col gap-4">
          <span className="text-label-sm text-primary-app uppercase tracking-widest">
            {destinationCities.join(" · ")}
          </span>
          <h3 className="text-headline-lg text-white leading-tight">
            {title}
          </h3>
          <p className="text-body-sm text-white/70 line-clamp-4 leading-relaxed">
            {content}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-primary-app text-body-sm font-semibold">
          Explore destination
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
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
