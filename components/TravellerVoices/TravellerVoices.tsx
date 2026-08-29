import type { StaticImageData } from "next/image";
import AutoSlider from "@/components/AutoSlider/AutoSlider";
import ReviewCard from "@/components/ReviewCard/ReviewCard";
import PhotoMosaic from "@/components/PhotoMosaic/PhotoMosaic";
import Reveal from "@/components/motion/Reveal";
import MosaicImage from "@/public/introImage6.jpg";
import type { Review } from "@/app/types/api";

interface TravellerVoicesProps {
  reviews: Review[];
  /** Anchor id — each page gives its own (e.g. "testimonials", "reviews"). */
  id: string;
  /** Small tracked label above the heading. */
  eyebrow?: string;
  title: string;
  /** Second heading line, rendered in the cyan italic accent. */
  titleAccent?: string;
  description?: string;
  /** Overrides the default mosaic photograph. */
  image?: string | StaticImageData;
  imageAlt?: string;
}

/**
 * The shared customer-feedback section: copy and one review at a time on the
 * left, a photo mosaic on the right. Used by the home page and the destination
 * detail page — give each its own id and wording.
 *
 * Renders nothing when there are no reviews, so callers don't need the guard.
 */
export default function TravellerVoices({
  reviews,
  id,
  eyebrow = "What they say",
  title,
  titleAccent,
  description,
  image = MosaicImage,
  imageAlt = "A yacht cutting across clear turquoise water",
}: TravellerVoicesProps) {
  if (reviews.length === 0) return null;

  return (
    <section id={id} className="mt-10 border-t border-outline md:mt-16">
      <div className="mx-auto max-w-(--container-max-w) px-6 py-12 md:px-10 md:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy + one review at a time.
              min-w-0: a grid item defaults to min-width:auto, and AutoSlider's
              track is width:200% with every card laid out side by side, so this
              column's min-content is roughly two cards wide. Without this the
              column refuses to shrink and pushes the plate off-screen. */}
          <Reveal className="flex min-w-0 flex-col gap-6">
            {eyebrow && (
              <span className="inline-flex items-center gap-3 text-label-md uppercase tracking-widest text-primary">
                {eyebrow}
                <span aria-hidden="true" className="h-px w-10 bg-primary/50" />
              </span>
            )}

            <h2 className="text-display-sm md:text-display-md text-text tracking-tighter leading-tight">
              {title}
              {titleAccent && (
                <>
                  <br />
                  <span className="text-primary italic">{titleAccent}</span>
                </>
              )}
            </h2>

            {description && (
              <p className="max-w-md text-body-lg leading-relaxed text-text-muted font-light">
                {description}
              </p>
            )}

            {/* One card at a time. The frosted plate wraps the slider rather
                than each slide, so the frame stays put and only the cards move. */}
            {/* Uneven padding from the reference — the plate reads as an offset
                backing rather than a symmetrical frame. Even and compact below
                md, where an off-centre card just wastes width. Right padding
                still clears the slider's arrows so neither one hangs off. */}
            <div className="mt-2 rounded-3xl bg-surface-low/80 p-4 backdrop-blur-md ghost-border md:pb-3 md:pl-12 md:pr-8 md:pt-5">
              <AutoSlider visibleCount={1} intervalMs={6000}>
                {reviews.slice(0, 6).map((review) => (
                  <ReviewCard key={review.id} {...review} />
                ))}
              </AutoSlider>
            </div>
          </Reveal>

          {/* Photo mosaic — only once the section is two columns. Stacked under
              the card on a phone it is just a large decorative block between
              the review and whatever follows. */}
          <Reveal delay={0.1} className="hidden min-w-0 lg:block">
            <PhotoMosaic src={image} alt={imageAlt} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
