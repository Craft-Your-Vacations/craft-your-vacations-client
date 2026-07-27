import React from "react";
import Image from "next/image";
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
      <span
        className="material-symbols-outlined absolute -top-2 -left-1 text-[80px] text-primary/10 pointer-events-none select-none"
        aria-hidden="true"
      >
        format_quote
      </span>

      {/* Quote */}
      <p className="text-body-lg text-text-muted relative z-10 pt-4">{quote}</p>

      {/* Author */}
      <div className="flex items-center gap-3 mt-2">
        <Image
          src={authorAvatarUrl}
          alt={authorAvatarAlt ?? authorName}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
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
