import React from "react";
import { Quote } from "lucide-react";
import Avatar from "@/components/Avatar/Avatar";
import type { TestimonialData } from "@/app/types/component";

interface TestimonialCardProps extends TestimonialData {
  className?: string;
}

export function TestimonialCard({
  quote,
  authorName,
  authorTitle,
  authorAvatarUrl,
  authorAvatarAlt,
  className = "",
}: TestimonialCardProps) {
  return (
    <div
      className={`relative flex flex-col gap-4 bg-surface rounded-2xl p-6 overflow-hidden ${className}`}
    >
      {/* Decorative quote icon */}
      <Quote
        className="absolute -top-2 -left-1 w-20 h-20 fill-primary/10 text-primary/10 pointer-events-none select-none"
        aria-hidden="true"
      />

      {/* Quote */}
      <p className="text-body-lg text-text-muted relative z-10 pt-4">{quote}</p>

      {/* Author */}
      <div className="flex items-center gap-3 mt-2">
        <Avatar
          name={authorName}
          imageUrl={authorAvatarUrl}
          imageAlt={authorAvatarAlt}
          variant="onSurface"
        />
        <div>
          <p className="text-body-md text-text font-semibold">{authorName}</p>
          {authorTitle && (
            <p className="text-body-sm text-text-muted">{authorTitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;
