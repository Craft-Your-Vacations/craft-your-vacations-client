import React from "react";
import { cn } from "@/lib/utils";

interface InfoChipProps {
  children: React.ReactNode;
  className?: string;
}

// A bordered surface "chip" for key/value facts (e.g. package detail stats).
export function InfoChip({ children, className = "" }: InfoChipProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface-high border border-outline",
        className
      )}
    >
      {children}
    </div>
  );
}

export default InfoChip;
