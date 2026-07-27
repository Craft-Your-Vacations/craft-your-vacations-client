import React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  /** Primary line — what's empty (e.g. "No bookings yet"). */
  title: string;
  /** Optional supporting sentence shown below the title. */
  description?: string;
  /** Optional icon rendered above the title. */
  icon?: React.ReactNode;
  /** Optional call-to-action (e.g. a Button) rendered below the text. */
  action?: React.ReactNode;
  className?: string;
}

// Reusable empty state, shared across customer + admin. A standalone glass panel
// rendered *instead of* a list/table when it has no items — never nested inside a
// Surface. Large-padding panel → rounded-3xl (see AGENTS.md design system).
export default function EmptyState({
  title,
  description,
  icon,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "glass ghost-border rounded-3xl p-12 flex flex-col items-center gap-5 text-center",
        className
      )}
    >
      {icon}
      <div>
        <p className="text-headline-sm text-text">{title}</p>
        {description && (
          <p className="text-body-md text-text-muted mt-1">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
