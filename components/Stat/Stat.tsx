import React from "react";
import { cn } from "@/lib/utils";

interface StatProps {
  /** Leading icon, sized ~w-4 h-4; it inherits the stat's accent color. */
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  className?: string;
}

// Compact "icon + label + value" stat used in booking / package detail summaries.
export function Stat({ icon, label, value, className = "" }: StatProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {icon && <span className="shrink-0 text-primary/70">{icon}</span>}
      <div>
        <p className="text-label-sm text-text-muted uppercase tracking-widest">
          {label}
        </p>
        <p className="text-body-sm text-text">{value}</p>
      </div>
    </div>
  );
}

export default Stat;
