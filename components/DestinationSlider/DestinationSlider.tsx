"use client";

import { useEffect, useState } from "react";
import AutoSlider from "@/components/AutoSlider/AutoSlider";
import DestinationCard from "@/components/DestinationCard/DestinationCard";
import type { Destination } from "@/app/types/api";

interface DestinationSliderProps {
  items: Destination[];
}

// Reuses the reviews/memories AutoSlider (chevrons anchored outside the track,
// exact full-card counts, no fade). visibleCount adapts to the viewport since
// the strip sits in a 2/3-width column on desktop.
export default function DestinationSlider({ items }: DestinationSliderProps) {
  const list = items.filter((d) => Boolean(d.imagePath));
  const [visible, setVisible] = useState(3);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setVisible(w >= 1280 ? 3 : w >= 640 ? 2 : 1);
    };
    // rAF keeps the initial measure out of the effect body (no sync setState).
    const raf = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (list.length === 0) return null;

  return (
    <AutoSlider visibleCount={visible} intervalMs={3500}>
      {list.map((d) => (
        <DestinationCard
          key={d.id}
          href={`/destinations/${d.slug}`}
          imagePath={d.imagePath}
          title={d.title}
          destinationCities={d.destinationCities}
          content={d.content}
          isFeatured={d.isFeatured}
        />
      ))}
    </AutoSlider>
  );
}
