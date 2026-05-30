"use client";

import Image from "next/image";
import AutoSlider from "@/components/AutoSlider/AutoSlider";
import type { UnsplashPhoto } from "@/app/types/api";

const UTM = "utm_source=craft_your_vacations&utm_medium=referral";

interface UnsplashPhotoSliderProps {
  photos: UnsplashPhoto[];
  visibleCount?: number;
}

function PhotoCard({ photo }: { photo: UnsplashPhoto }) {
  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden group">
      <Image
        src={photo.urls.regular}
        alt={`Photo by ${photo.user.name} on Unsplash`}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      {/* Attribution overlay */}
      <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/60 to-transparent px-4 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-label-sm text-white/90">
          Photo by{" "}
          <a
            href={`${photo.user.links.html}?${UTM}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {photo.user.name}
          </a>{" "}
          on{" "}
          <a
            href={`${photo.links.html}?${UTM}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            Unsplash
          </a>
        </p>
      </div>
    </div>
  );
}

export default function UnsplashPhotoSlider({
  photos,
  visibleCount = 1,
}: UnsplashPhotoSliderProps) {
  if (photos.length === 0) return null;

  return (
    <div>
      <AutoSlider visibleCount={visibleCount} intervalMs={3500}>
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </AutoSlider>
      <p className="text-label-sm text-text-subtle text-right mt-2">
        Photos from{" "}
        <a
          href={`https://unsplash.com/?${UTM}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-text-muted"
        >
          Unsplash
        </a>
      </p>
    </div>
  );
}
