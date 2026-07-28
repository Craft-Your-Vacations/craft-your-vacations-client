import { Compass, PenLine, Plane } from "lucide-react";
import PillarCard from "./PillarCard";

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
        {/* Top block */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 mb-16">
          {/* Left — text */}
          <div className="flex-1 flex flex-col gap-6">
            <span className="text-label-sm text-primary uppercase tracking-[0.2em]">
              Who We Are
            </span>
            <h2 className="text-display-sm text-text tracking-tighter leading-tight">
              Travel on <span className="text-primary italic">your terms</span>
            </h2>
            <p className="text-body-lg text-text-muted max-w-lg leading-relaxed font-light">
              We&apos;re not a travel agency — we&apos;re your planning partner.
              At CraftYourVacations, we believe the best journeys are the ones
              you design yourself. We give you the destinations, the insights,
              and the structure. You bring the curiosity. No rigid packages, no
              cookie-cutter schedules — just your story, told your way.
            </p>
          </div>

          {/* Right — stats */}
          <div className="grid grid-cols-3 gap-4 lg:flex lg:flex-col lg:gap-6 lg:items-end">
            {stats.map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-1 lg:text-right">
                <span className="text-display-sm text-primary font-bold tracking-tighter">
                  {value}
                </span>
                <span className="text-label-md text-text-subtle">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Three pillar cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map(({ icon, title, body }) => (
            <PillarCard key={title} icon={icon} title={title} body={body} />
          ))}
        </div>
      </div>
    </section>
  );
}
