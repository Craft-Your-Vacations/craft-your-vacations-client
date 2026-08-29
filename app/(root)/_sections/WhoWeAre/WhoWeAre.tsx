import { Compass, PenLine, Plane } from "lucide-react";
import PillarCard from "./PillarCard";
import PhotoCluster, {
  type ClusterImage,
} from "@/components/PhotoCluster/PhotoCluster";
import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import CoverImage1 from "@/public/coverImage1.jpg";
import CoverImage2 from "@/public/coverImage2.jpg";
import CoverImage3 from "@/public/coverImage3.jpg";

const clusterImages: [ClusterImage, ClusterImage, ClusterImage] = [
  { src: CoverImage1, alt: "Overwater villas in the Maldives" },
  { src: CoverImage2, alt: "Alpine peaks in Switzerland" },
  { src: CoverImage3, alt: "Rooftops of Paris" },
];

const stats = [
  { value: "50+", label: "Destinations" },
  { value: "10k+", label: "Itineraries crafted" },
  { value: "100%", label: "Your design" },
];

const pillars = [
  {
    icon: Compass,
    title: "Dream It",
    body: "Tell us where your curiosity leads. We surface destinations that match your pace, your taste, and your sense of wonder.",
  },
  {
    icon: PenLine,
    title: "Craft It",
    body: "Build your itinerary day by day. Every stay, every experience, every detour — yours to shape exactly as you imagine.",
  },
  {
    icon: Plane,
    title: "Live It",
    body: "Set off with confidence. Every detail planned, every moment yours to own. No surprises unless you want them.",
  },
];

export default function WhoWeAre() {
  return (
    <section id="about" className="mt-10 md:mt-16">
      <div className="mx-auto max-w-(--container-max-w) px-6 md:px-10">
        {/* Top block — text (left) · fanned photo cluster (right) */}
        <Reveal className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 md:items-center mb-16">
          {/* Text + stats */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <span className="text-label-sm text-primary uppercase tracking-[0.2em]">
              Who We Are
            </span>
            <h2 className="text-display-md text-text tracking-tighter leading-tight">
              Travel on <span className="text-primary italic">your terms</span>
            </h2>
            <p className="text-body-lg text-text-muted max-w-lg leading-relaxed font-light">
              We&apos;re not a travel agency — we&apos;re your planning partner.
              At CraftYourVacations, we believe the best journeys are the ones
              you design yourself. We give you the destinations, the insights,
              and the structure. You bring the curiosity. No rigid packages, no
              cookie-cutter schedules — just your story, told your way.
            </p>

            {/* Compact stat strip */}
            <div className="flex flex-wrap gap-x-8 gap-y-4 pt-2">
              {stats.map(({ value, label }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-headline-lg text-primary font-bold tracking-tighter">
                    {value}
                  </span>
                  <span className="text-label-sm text-text-subtle">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fanned photo cluster */}
          <div className="md:col-span-7">
            <PhotoCluster images={clusterImages} />
          </div>
        </Reveal>

        {/* Three pillar cards */}
        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map(({ icon, title, body }, index) => (
            <StaggerItem key={title}>
              <PillarCard icon={icon} title={title} body={body} index={index} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
