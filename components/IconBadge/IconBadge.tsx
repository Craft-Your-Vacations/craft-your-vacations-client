import React from "react";
import { cn } from "@/lib/utils";

interface IconBadgeProps {
  children: React.ReactNode;
  className?: string;
}

// Square brand-tinted icon container used beside labels in detail views.
export function IconBadge({ children, className = "" }: IconBadgeProps) {
  return (
    <span
      className={cn(
        "w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0",
        className
      )}
    >
      {children}
    </span>
  );
}

export default IconBadge;
