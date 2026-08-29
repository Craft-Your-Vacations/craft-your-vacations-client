import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

interface PhotoMosaicProps {
  src: string | StaticImageData;
  /** Describes the photograph — the mosaic reads as one image to a screen reader. */
  alt: string;
  className?: string;
}

/**
 * A single photograph revealed through a staggered grid of rounded tiles. Every
 * tile shows its own region of the same image (see the `mosaic-tile` utility),
 * so the result is one continuous picture broken into an arch-shaped cluster.
 *
 * Geometry is percentages of the mosaic box, so the whole thing is responsive
 * with no measurement. Five columns 18.8% wide with 1.5% gaps (tight enough
 * that the tiles still read as one photograph); the tops and bottoms taper away
 * from the centre to form the arch.
 */
const TILES = [
  { l: 0, t: 26, w: 18.8, h: 25 },
  { l: 0, t: 52.5, w: 18.8, h: 19 },
  { l: 20.3, t: 12, w: 18.8, h: 31 },
  { l: 20.3, t: 44.5, w: 18.8, h: 33 },
  { l: 40.6, t: 0, w: 18.8, h: 43 },
  { l: 40.6, t: 44.5, w: 18.8, h: 41 },
  { l: 60.9, t: 8, w: 18.8, h: 35 },
  { l: 60.9, t: 44.5, w: 18.8, h: 31 },
  { l: 81.2, t: 20, w: 18.8, h: 27 },
  { l: 81.2, t: 48.5, w: 18.8, h: 21 },
  // Two small tiles dangling below the arch, breaking the grid.
  { l: 20.3, t: 79, w: 8.5, h: 12 },
  { l: 60.9, t: 77, w: 8.5, h: 12 },
];

export default function PhotoMosaic({ src, alt, className = "" }: PhotoMosaicProps) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn("relative aspect-4/3 w-full", className)}
    >
      {TILES.map((tile, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="mosaic-tile rounded-2xl"
          style={
            {
              "--l": tile.l,
              "--t": tile.t,
              "--w": tile.w,
              "--h": tile.h,
            } as React.CSSProperties
          }
        >
          <Image
            src={src}
            alt=""
            width={1200}
            height={900}
            sizes="(min-width: 1024px) 45vw, 90vw"
            priority={false}
          />
        </span>
      ))}
    </div>
  );
}
