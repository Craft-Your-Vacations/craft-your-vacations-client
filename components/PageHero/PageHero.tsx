import Image from "next/image";
import { ChevronLeft, MapPin } from "lucide-react";

export interface HeroChip {
  icon: React.ReactNode;
  label: string;
}

interface PageHeroProps {
  /** Background image URL. If omitted, a solid surface fallback is shown. */
  imagePath?: string;
  imageAlt?: string;
  title: string;
  /** Optional subtitle shown between the title and stat chips (e.g. package excerpt). */
  subtitle?: string;
  /** City / location tag pills shown above the title. */
  tags?: string[];
  /** Stat chips shown below the title (e.g. "12 Packages", "5–10 Days"). */
  chips?: HeroChip[];
  onBack: () => void;
  className?: string;
}

export default function PageHero({
  imagePath,
  imageAlt = "",
  title,
  subtitle,
  tags,
  chips,
  onBack,
  className = "",
}: PageHeroProps) {
  return (
    <div
      className={`relative w-full h-(--hero-height) min-h-130 overflow-hidden ${className}`}
    >
      {/* Background image or fallback */}
      {imagePath ? (
        <Image
          src={imagePath}
          alt={imageAlt}
          fill
          sizes="100vw"
          className="object-cover scale-105"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-surface-high" />
      )}

      {/* Cinematic gradient layers */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-black/20" />
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/15 to-transparent" />

      {/* Back button — glass pill */}
      <div className="absolute top-6 left-0 right-0 max-w-(--container-max-w) mx-auto px-6 md:px-10">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/15 text-white/80 hover:text-white hover:bg-black/45 transition-all text-label-sm font-medium cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Content — sits in the lower portion with generous spacing */}
      <div className="absolute bottom-0 left-0 right-0 max-w-(--container-max-w) mx-auto px-6 md:px-10 pb-12 flex flex-col gap-5">

        {/* Location tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/35 text-label-sm text-primary-app uppercase tracking-widest"
              >
                <MapPin className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title + subtitle */}
        <div className="flex flex-col gap-3">
          <h1 className="text-display-sm md:text-display-xl text-white font-bold leading-hero drop-shadow-lg max-w-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-body-lg text-white/65 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Stat chips */}
        {chips && chips.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {chips.map((chip, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg"
              >
                <span className="text-primary-app shrink-0">
                  {chip.icon}
                </span>
                <span className="text-white text-body-sm font-semibold tracking-wide">
                  {chip.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
