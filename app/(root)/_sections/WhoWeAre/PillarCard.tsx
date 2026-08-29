import type { LucideIcon } from "lucide-react";

interface PillarCardProps {
  icon: LucideIcon;
  title: string;
  body: string;
  /** Zero-based position — rendered as a large ghosted step number. */
  index?: number;
}

export default function PillarCard({
  icon: Icon,
  title,
  body,
  index,
}: PillarCardProps) {
  return (
    // Hover treatment is transform/opacity/border-color only (no box-shadow
    // animation) — the "glow" is a blurred layer faded in via opacity.
    <div className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-3xl glass ghost-border p-8 shadow-lg shadow-primary/10 transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/40">
      {/* Soft primary glow, revealed on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-primary/25 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Gradient icon badge + step number */}
      <div className="relative flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl btn-gradient shadow-lg shadow-primary/30 transition-transform duration-300 ease-out group-hover:scale-105">
          <Icon className="h-6 w-6" strokeWidth={1.75} />
        </div>
        {typeof index === "number" && (
          <span className="text-display-md font-extrabold leading-none text-primary/20 transition-colors duration-300 group-hover:text-primary/35">
            0{index + 1}
          </span>
        )}
      </div>

      {/* Text */}
      <div className="relative flex flex-col gap-2">
        <h3 className="text-headline-md text-text">{title}</h3>
        <p className="text-body-sm text-text-muted leading-relaxed">{body}</p>
      </div>

      {/* Accent underline that grows on hover (scaleX = GPU, no layout) */}
      <div className="relative mt-auto h-1 w-16 origin-left scale-x-[0.55] rounded-full bg-primary/40 transition-[transform,background-color] duration-300 ease-out group-hover:scale-x-100 group-hover:bg-primary" />
    </div>
  );
}
