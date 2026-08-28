import { Fragment } from "react";
import Image from "next/image";
import { MapPin, ChevronDown } from "lucide-react";
import Button from "@/components/Button/Button";
import Chip from "@/components/Chip/Chip";

export interface HeroStat {
  value: string;
  label: string;
}

interface GlassHeroProps {
  /** Single background image URL. Falls back to a solid surface if omitted. */
  image?: string;
  imageAlt?: string;
  /** Small label above the title (e.g. "Discover"). */
  eyebrow?: string;
  title: string;
  /** About copy shown under the title. */
  description?: string;
  /** Location pills shown under the title (e.g. cities). */
  tags?: string[];
  /** Key-stat row shown under the description (e.g. price, packages, days). */
  stats?: HeroStat[];
  /** Primary call-to-action (anchor link). */
  cta?: { label: string; href: string };
}

export default function GlassHero({
  image,
  imageAlt = "",
  eyebrow,
  title,
  description,
  tags,
  stats,
  cta,
}: GlassHeroProps) {
  return (
    // id is observed by the Navbar to toggle its transparent/solid state.
    <section id="hero-sentinel" className="relative w-full min-h-dvh overflow-hidden">
      {/* Base image — full-bleed; provides the blurred scenery seen through the glass */}
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-surface-high" />
      )}

      {/* Sharp, centre-framed copy on the right (sharp) half so the photo's
          subject stays visible instead of sitting under the glass edge. The
          full-width base image would only show the photo's right portion here;
          this shows its centre. Desktop only — mobile keeps the full-bleed base. */}
      {image && (
        <div className="absolute inset-y-0 right-0 hidden w-1/2 overflow-hidden md:block">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="50vw"
            className="object-cover object-center"
          />
        </div>
      )}

      {/* Frosted-glass panel covering the left half with a hard edge.
          No mask — a plain box clips its backdrop-blur exactly to the box edge,
          so the blur ends on a clean vertical line at the midpoint. Rich recipe:
          strong blur + saturate (chromatic depth), a deep translucent gradient
          fill, and a thin specular highlight on the leading edge. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-full backdrop-blur-2xl backdrop-saturate-150 bg-linear-to-br from-black/80 to-black/50 border-r border-white/10 md:w-1/2"
      />

      {/* Overlaid content, vertically centred */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full max-w-(--container-max-w) mx-auto px-6 md:px-10">
          {/* Constrain to the left glass half (md+) so the copy wraps inside it. */}
          <div className="flex w-full max-w-xl flex-col gap-5 text-white animate-hero-rise md:w-1/2 md:max-w-none md:pr-8">
            {eyebrow && (
              <span className="text-label-md uppercase tracking-widest text-white/70">
                {eyebrow}
              </span>
            )}

            <h1 className="text-display-lg md:text-display-xl font-bold leading-hero drop-shadow-lg">
              {title}
            </h1>

            {tags && tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {tags.map((tag) => (
                  <Chip key={tag} icon={<MapPin className="w-3 h-3" />}>
                    {tag}
                  </Chip>
                ))}
              </div>
            )}

            {description && (
              <p className="max-w-md text-body-md md:text-body-lg text-white/80 leading-relaxed line-clamp-5">
                {description}
              </p>
            )}

            {stats && stats.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {stats.map((stat, i) => (
                  <Fragment key={stat.label}>
                    {i > 0 && (
                      <span aria-hidden className="hidden h-8 w-px bg-white/20 md:block" />
                    )}
                    <div className="flex flex-col">
                      <span className="text-headline-sm text-white">{stat.value}</span>
                      <span className="text-label-sm uppercase tracking-widest text-white/60">
                        {stat.label}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
            )}

            {cta && (
              <div className="mt-2">
                <Button variant="primary" size="lg" href={cta.href}>
                  {cta.label}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll-down cue, aligned to the content's left edge */}
      <div className="absolute bottom-8 left-0 right-0">
        <div className="max-w-(--container-max-w) mx-auto px-6 md:px-10">
          <ChevronDown
            aria-hidden="true"
            className="animate-hero-bob h-6 w-6 text-white/55"
          />
        </div>
      </div>
    </section>
  );
}
