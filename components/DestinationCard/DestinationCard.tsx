//Destination Card

import React from "react";
import type { DestinationCardData } from "@/app/types/component";
import Image from "next/image";
import Link from "next/link";

interface DestinationCardProps extends DestinationCardData {
  className?: string;
}

export function DestinationCard({
  imagePath,
  destinationCities,
  title,
  content,
  href,
  className = "",
}: DestinationCardProps) {
  const cardContent = (
    <div
      className={`group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg shadow-primary/20 ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-3/4 overflow-hidden">
        <Image
          src={imagePath}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col gap-2">
        <span className="self-start px-3 py-1 rounded-full text-label-sm border border-primary-app/20 bg-primary-app/20 text-primary-app">
          {destinationCities.join(",")}
        </span>
        <h3 className="text-headline-md text-white">{title}</h3>
        <p className="text-body-sm text-white/70 line-clamp-2">{content}</p>
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
