"use client";

import { cn } from "@/lib/utils";

interface SegmentedOption<T extends string> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

// Pill-style segmented tab switcher (the "Email / Google" style control).
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = "",
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        "flex w-full bg-surface-highest rounded-2xl p-1 gap-1",
        className
      )}
      role="tablist"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex-1 py-2 rounded-xl text-body-sm-bold transition-all cursor-pointer",
              active
                ? "bg-surface text-text shadow-ambient"
                : "text-text-muted hover:text-text"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
