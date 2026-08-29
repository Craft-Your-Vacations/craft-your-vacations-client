"use client";

import { useEffect, useState } from "react";

interface VisibleCounts {
  /** Slots below 640px — also the server-rendered value. */
  base: number;
  /** Slots from 640px up. */
  sm?: number;
  /** Slots from 1024px up. */
  lg?: number;
}

/**
 * How many slider slots fit at the current viewport width.
 *
 * Sliders need this as a number for their track maths, so it can't be pure CSS.
 * Owning it here keeps the resize listener out of every page that renders one.
 * Starts at `base` so the first client render matches the server's.
 */
export function useVisibleCount({ base, sm, lg }: VisibleCounts): number {
  const [count, setCount] = useState(base);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCount(w >= 1024 ? (lg ?? sm ?? base) : w >= 640 ? (sm ?? base) : base);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [base, sm, lg]);

  return count;
}

export default useVisibleCount;
