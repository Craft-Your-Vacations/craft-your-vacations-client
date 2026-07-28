import Image from "next/image";
import Section from "@/components/Section/Sections";
import AutoSlider from "@/components/AutoSlider/AutoSlider";
import type { Review } from "@/app/types/api";

interface MemoriesSectionProps {
  reviews: Review[];
  visibleCount: number;
}

export default function MemoriesSection({
  reviews,
  visibleCount,
}: MemoriesSectionProps) {
  const memories = reviews.flatMap((r) => r.imagePaths);
  if (memories.length === 0) return null;

  return (
    <Section id="memories" title="">
      <div className="mb-8">
        <h2 className="text-headline-lg text-text">
          Memories From Our Customers
        </h2>
        <p className="text-body-md text-text-muted mt-1">
          Moments captured by fellow travellers
        </p>
      </div>
      <AutoSlider visibleCount={visibleCount} intervalMs={3000}>
        {memories.map((src, i) => (
          <div
            key={i}
            className="relative aspect-square rounded-2xl overflow-hidden"
          >
            <Image
              src={src}
              alt={`Customer memory ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
        ))}
      </AutoSlider>
    </Section>
  );
}
