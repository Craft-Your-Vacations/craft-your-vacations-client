"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/Button/Button";

interface AutoSliderProps {
  children: React.ReactNode[];
  visibleCount?: number;
  intervalMs?: number;
  className?: string;
}

export default function AutoSlider({
  children,
  visibleCount = 1,
  intervalMs = 4000,
  className = "",
}: AutoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isPaused = useRef(false);
  const total = children.length;

  const maxIndex = Math.max(0, total - visibleCount);

  useEffect(() => {
    if (total <= visibleCount) return;

    const timer = setInterval(() => {
      if (!isPaused.current) {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [total, visibleCount, intervalMs, maxIndex]);

  const itemWidthPercent = 100 / visibleCount;

  return (
    <div
      className={`${className}`}
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
      onFocus={() => { isPaused.current = true; }}
      onBlur={() => { isPaused.current = false; }}
    >
      {/* Track row — relative so chevrons can anchor to its edges */}
      <div className="relative">
        {total > visibleCount && (
          <Button
            variant="icon"
            size="sm"
            aria-label="Previous"
            className="absolute -left-7 top-1/2 -translate-y-1/2 z-10 shadow-md"
            onClick={() => {
              isPaused.current = true;
              setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}

        {/* overflow-hidden is on the inner wrapper; py-4 px-1 give shadows
            room to render before being clipped at the padding edge */}
        <div className="overflow-hidden py-4 px-1">
          {/* Track */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${(currentIndex * 100) / total}%)`,
              width: `${(total / visibleCount) * 100}%`,
            }}
          >
            {children.map((child, i) => (
              <div
                key={i}
                style={{ width: `${itemWidthPercent / (total / visibleCount)}%` }}
                className="px-3 box-border"
              >
                {child}
              </div>
            ))}
          </div>
        </div>

        {total > visibleCount && (
          <Button
            variant="icon"
            size="sm"
            aria-label="Next"
            className="absolute -right-7 top-1/2 -translate-y-1/2 z-10 shadow-md"
            onClick={() => {
              isPaused.current = true;
              setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Dot indicators — visual only */}
      {total > visibleCount && (
        <div className="flex justify-center gap-2 mt-3">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? "w-4 bg-primary" : "w-1.5 bg-text-subtle"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
