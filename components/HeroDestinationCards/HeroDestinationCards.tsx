"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/app/types/api";

interface HeroDestinationCardsProps {
  items: Destination[];
}

const AUTO_MS = 3200;
const SLIDE_MS = 650;
const STEP = 208; // card width (w-48 = 192) + gap (16)
const LEFT_INSET = 32;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

// Visual treatment by position relative to the lead (delta = index - lead).
// The three on-screen cards stay fully opaque; only the card leaving on the left
// and the one waiting on the right fade.
function styleFor(delta: number) {
  if (delta === 0) return { opacity: 1, scale: 1.25, z: 20 }; // lead (zoomed)
  if (delta === 1) return { opacity: 1, scale: 0.82, z: 10 };
  if (delta === 2) return { opacity: 1, scale: 0.82, z: 5 };
  return { opacity: 0, scale: 0.82, z: 0 }; // exiting left / waiting right
}

export default function HeroDestinationCards({ items }: HeroDestinationCardsProps) {
  const base = items.filter((d) => Boolean(d.imagePath)).slice(0, 6);
  const loop = [...base, ...base];
  const len = base.length;

  const [lead, setLead] = useState(0);
  const [noTransition, setNoTransition] = useState(false);

  useEffect(() => {
    if (len <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setLead((v) => v + 1), AUTO_MS);
    return () => clearInterval(t);
  }, [len]);

  useEffect(() => {
    if (lead < len) return;
    const t = setTimeout(() => {
      setNoTransition(true);
      setLead((v) => v - len);
    }, SLIDE_MS);
    return () => clearTimeout(t);
  }, [lead, len]);

  useEffect(() => {
    if (!noTransition) return;
    const r = requestAnimationFrame(() =>
      requestAnimationFrame(() => setNoTransition(false)),
    );
    return () => cancelAnimationFrame(r);
  }, [noTransition]);

  if (len === 0) return null;

  const activeDot = ((lead % len) + len) % len;

  return (
    <div className="pointer-events-none absolute right-0 top-[63%] hidden w-1/2 -translate-y-1/2 flex-col gap-5 xl:flex">
      {/* Refined label */}
      <div className="flex items-center gap-3" style={{ paddingLeft: LEFT_INSET }}>
        <span className="h-px w-10 bg-primary-app" />
        <span className="text-label-md uppercase tracking-widest text-white/75">
          Handpicked escapes
        </span>
      </div>

      {/* Sliding cards */}
      <div className="relative h-96 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 flex items-center gap-4"
          style={{
            transform: `translateX(${LEFT_INSET - lead * STEP}px)`,
            transition: noTransition ? "none" : `transform ${SLIDE_MS}ms ${EASE}`,
          }}
        >
          {loop.map((d, j) => {
            const { opacity, scale, z } = styleFor(j - lead);
            return (
              <Link
                key={j}
                href={`/destinations/${d.slug}`}
                aria-label={`Explore ${d.title}`}
                className="group pointer-events-auto relative aspect-3/4 w-48 shrink-0 overflow-hidden rounded-2xl shadow-lg shadow-primary/20"
                style={{
                  opacity,
                  zIndex: z,
                  transform: `scale(${scale})`,
                  transition: noTransition
                    ? "none"
                    : `transform ${SLIDE_MS}ms ${EASE}, opacity ${SLIDE_MS}ms ease`,
                }}
              >
                <Image
                  src={d.imagePath}
                  alt={d.title}
                  fill
                  sizes="260px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />
                <h3 className="absolute inset-x-0 bottom-0 p-4 font-display text-headline-md font-bold uppercase leading-tight tracking-tight text-white">
                  {d.title}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Slider dots */}
      <div className="flex items-center gap-1.5" style={{ paddingLeft: LEFT_INSET }}>
        {base.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeDot ? "w-6 bg-primary-app" : "w-1.5 bg-white/35"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
