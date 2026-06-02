import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { DISPLAY_PHONE, WHATSAPP_URL } from "@/lib/contact";
import BannerBg from "@/public/introImage3.jpg";

interface CtaBannerProps {
  heading?: string;
  subtext?: string;
  imageAlt?: string;
}

export default function CtaBanner({
  heading = "Plan an Unforgettable Experience Today!",
  subtext = "We can help you craft the perfect trip within your budget.",
  imageAlt = "Contact Us",
}: CtaBannerProps) {
  return (
    <section className="relative w-full min-h-100 flex items-center mt-20 justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src={BannerBg}
        alt={imageAlt}
        fill
        className="object-cover"
        sizes="100vw"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-16 text-center max-w-3xl mx-auto">
        <h2 className="text-display-sm md:text-display-md text-white font-serif leading-tight tracking-tight">
          {heading}
        </h2>
        <p className="text-body-lg text-white/70 max-w-xl">{subtext}</p>

        <div className="flex flex-col items-center gap-2 mt-2">
          <span className="text-label-sm text-white/50 uppercase tracking-[0.2em]">
            Book your stay now
          </span>
          <Link
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-white hover:text-white/80 transition-colors"
          >
            <Phone className="w-7 h-7 shrink-0" />
            <span className="text-display-sm font-bold tracking-tight">
              {DISPLAY_PHONE}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
