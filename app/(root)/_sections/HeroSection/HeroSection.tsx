import Button from "@/components/Button/Button";
import Image from "next/image";
import IntroIcon1 from "@/public/introImage1.jpg";
import IntroIcon2 from "@/public/introImage2.jpg";

export default function HeroSection() {
  return (
    <section className="relative min-h-[60vh] md:min-h-[75vh] lg:h-230.25 pt-20 md:pt-0 flex items-center overflow-hidden bg-surface-low">
      <div className="mx-auto max-w-(--container-max-w) px-6 md:px-10 w-full">
        <div className="z-10 lg:w-1/2">
          <span className="label text-primary font-bold tracking-[0.2em] mb-6 block uppercase text-label-sm">
            Elevate Your Perspective
          </span>
          <h1 className="text-display-lg md:text-display-xl lg:text-display-xxl text-text tracking-tighter leading-[0.9] mb-8">
            Explore the <br />
            <span className="text-stroke-primary italic inline-block px-1 py-1">
              Extraordinary
            </span>
          </h1>
          <p className="text-text-muted text-body-lg md:text-xl max-w-xl mb-6 md:mb-10 leading-relaxed font-light">
            Bespoke journeys curated for the discerning traveler. From the
            silence of Nordic fjords to the vibrant pulse of tropical
            archipelagos.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/destinations">Begin Your Story</Button>
          </div>
        </div>
        <div className="absolute right-[-5%] top-[10%] w-1/2 h-[80%] z-0 hidden lg:block">
          <div className="relative w-full h-full">
            <div className="absolute top-0 right-0 w-4/5 h-[85%] rounded-3xl overflow-hidden shadow-2xl z-20">
              <Image
                src={IntroIcon1}
                fill
                objectFit="cover"
                sizes="40vw"
                alt="Intro icon"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-3/5 h-[50%] rounded-3xl overflow-hidden shadow-2xl z-30 border-8 border-white">
              <Image src={IntroIcon2} alt="Intro icon" fill={true} sizes="30vw" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
