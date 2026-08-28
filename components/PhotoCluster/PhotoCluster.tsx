import Image, { type StaticImageData } from "next/image";

export interface ClusterImage {
  src: StaticImageData;
  alt: string;
}

interface PhotoClusterProps {
  /** Exactly three images: [left, middle, right]. */
  images: [ClusterImage, ClusterImage, ClusterImage];
  className?: string;
}

// Three portrait photo cards fanned in a horizontal arc (left lower + tilted
// left, middle upright, right higher + tilted right). Gently spreads on hover.
// Transform-only (GPU); the global prefers-reduced-motion backstop makes it snap.
export default function PhotoCluster({ images, className = "" }: PhotoClusterProps) {
  const [left, middle, right] = images;
  const card =
    "relative aspect-[3/4] overflow-hidden rounded-2xl ring-2 ring-white/60 shadow-lg shadow-primary/20 transition-transform duration-500 ease-out will-change-transform";
  const sizes = "(max-width: 768px) 30vw, 16vw";

  return (
    <div className={`group flex items-center justify-center ${className}`}>
      {/* Left — smaller, lower, tilted left */}
      <div
        className={`${card} z-10 w-[30%] -rotate-[10deg] translate-y-5 group-hover:-translate-x-4 group-hover:-rotate-[14deg]`}
      >
        <Image src={left.src} alt={left.alt} fill sizes={sizes} className="object-cover" />
      </div>

      {/* Middle — near-upright anchor, overlaps its neighbours */}
      <div
        className={`${card} z-20 -mx-5 w-[34%] -rotate-[1deg] group-hover:-translate-y-3`}
      >
        <Image src={middle.src} alt={middle.alt} fill sizes={sizes} className="object-cover" />
      </div>

      {/* Right — largest, higher, tilted right */}
      <div
        className={`${card} z-30 w-[36%] rotate-[10deg] -translate-y-5 group-hover:translate-x-4 group-hover:rotate-[14deg]`}
      >
        <Image src={right.src} alt={right.alt} fill sizes={sizes} className="object-cover" />
      </div>
    </div>
  );
}
