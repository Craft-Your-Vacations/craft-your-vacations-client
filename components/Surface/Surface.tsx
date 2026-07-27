import React from "react";
import { cn } from "@/lib/utils";

type SurfaceVariant = "default" | "table";

interface SurfaceProps {
  variant?: SurfaceVariant;
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
}

// Glass container primitive. Role-based radius: panels = rounded-2xl (see AGENTS.md).
// - default : padded panel (owns its own spacing)
// - table   : flush container that clips its children (wrap tables / edge-to-edge lists)
const variantClasses: Record<SurfaceVariant, string> = {
  default: "glass rounded-2xl p-6 flex flex-col gap-5",
  table: "glass rounded-2xl overflow-hidden",
};

export function Surface({
  variant = "default",
  as: Component = "div",
  className = "",
  children,
}: SurfaceProps) {
  return (
    <Component className={cn(variantClasses[variant], className)}>
      {children}
    </Component>
  );
}

export default Surface;
