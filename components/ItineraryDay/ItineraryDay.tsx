"use client";

import { useState } from "react";
import {
  ChevronDown,
  Plane,
  Sun,
  Camera,
  UtensilsCrossed,
  Landmark,
  Mountain,
} from "lucide-react";
import type { Activity, ActivityType } from "@/app/types/api";

interface ItineraryDayProps {
  dayNumber: number;
  title: string;
  activities: Activity[];
  defaultOpen?: boolean;
}

const activityConfig: Record<
  ActivityType,
  { label: string; icon: React.ReactNode }
> = {
  transport: { label: "Transport", icon: <Plane className="w-3.5 h-3.5" /> },
  leisure: { label: "Leisure", icon: <Sun className="w-3.5 h-3.5" /> },
  sightseeing: {
    label: "Sightseeing",
    icon: <Camera className="w-3.5 h-3.5" />,
  },
  dining: {
    label: "Dining",
    icon: <UtensilsCrossed className="w-3.5 h-3.5" />,
  },
  cultural: { label: "Cultural", icon: <Landmark className="w-3.5 h-3.5" /> },
  adventure: { label: "Adventure", icon: <Mountain className="w-3.5 h-3.5" /> },
};

export function ItineraryDay({
  dayNumber,
  title,
  activities,
  defaultOpen = false,
}: ItineraryDayProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const uniqueTypes = [...new Set(activities.map((a) => a.type))];

  return (
    <div
      className={`rounded-2xl border bg-surface overflow-hidden transition-all duration-200 ${
        isOpen
          ? "border-primary/40 shadow-ambient"
          : "border-outline hover:border-primary/30"
      }`}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="w-full flex items-center gap-4 px-5 py-4 text-left group"
      >
        {/* Day pill */}
        <span className="shrink-0 min-w-18 text-center px-3 py-1.5 rounded-xl bg-primary/15 border border-primary/30 text-primary text-label-sm font-bold tracking-widest uppercase">
          Day {String(dayNumber).padStart(2, "0")}
        </span>

        {/* Title */}
        <span className="flex-1 min-w-0 text-body-md md:text-headline-sm text-text group-hover:text-primary transition-colors">
          {title}
        </span>

        {/* Activity type icon previews (collapsed only) */}
        {!isOpen && (
          <div className="hidden md:flex items-center gap-1 shrink-0">
            {uniqueTypes.map((type) => {
              const cfg = activityConfig[type] ?? activityConfig.leisure;
              return (
                <span
                  key={type}
                  title={cfg.label}
                  className="w-6 h-6 rounded-xl bg-primary/10 text-primary flex items-center justify-center"
                >
                  {cfg.icon}
                </span>
              );
            })}
          </div>
        )}

        {/* Activity count — hidden on mobile, shown in expanded body instead */}
        <span className="hidden md:inline-flex shrink-0 px-2.5 py-1 rounded-full bg-surface-high text-text-muted text-label-sm">
          {activities.length}{" "}
          {activities.length === 1 ? "activity" : "activities"}
        </span>

        {/* Chevron */}
        <ChevronDown
          className={`shrink-0 w-5 h-5 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-primary" : "text-text-muted"
          }`}
        />
      </button>

      {/* Expandable body */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-750 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5">
          <div className="h-px bg-outline mb-4" />

          {/* Activity count — mobile only */}
          <span className="md:hidden inline-flex mb-3 px-2.5 py-1 rounded-full bg-surface-high text-text-muted text-label-sm">
            {activities.length}{" "}
            {activities.length === 1 ? "activity" : "activities"}
          </span>

          <div className="flex flex-col gap-3">
            {activities.map((activity, i) => {
              const cfg =
                activityConfig[activity.type] ?? activityConfig.leisure;
              return (
                <div
                  key={i}
                  className="flex gap-0 rounded-xl border border-outline border-l-2 border-l-primary/60 bg-surface-high overflow-hidden"
                >
                  {/* Time column */}
                  <div className="flex items-center justify-center px-4 py-3 min-w-18 border-r border-outline shrink-0">
                    <span className="text-label-sm font-semibold text-text-muted tabular-nums">
                      {activity.time}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex items-start gap-3 px-4 py-3 flex-1">
                    {/* Icon badge */}
                    <div className="shrink-0 w-7 h-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center mt-0.5">
                      {cfg.icon}
                    </div>

                    <div className="flex flex-col gap-1 flex-1">
                      <span className="self-start px-2 py-0.5 rounded-full bg-primary/10 text-primary text-label-sm font-semibold">
                        {cfg.label}
                      </span>
                      <p className="text-body-sm text-text leading-relaxed">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItineraryDay;
