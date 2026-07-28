import Section from "@/components/Section/Sections";
import UnsplashPhotoSlider from "@/components/UnsplashPhotoSlider/UnsplashPhotoSlider";
import type { UnsplashPhoto } from "@/app/types/api";

interface PhotoGalleryProps {
  title: string;
  photos: UnsplashPhoto[];
  visibleCount: number;
}

export default function PhotoGallery({
  title,
  photos,
  visibleCount,
}: PhotoGalleryProps) {
  if (photos.length === 0) return null;

  return (
    <Section id="photo-gallery" title="">
      <div className="mb-8">
        <h2 className="text-headline-lg text-text">Explore {title}</h2>
        <p className="text-body-md text-text-muted mt-1">
          A glimpse of what awaits you
        </p>
      </div>
      <UnsplashPhotoSlider photos={photos} visibleCount={visibleCount} />
    </Section>
  );
}
