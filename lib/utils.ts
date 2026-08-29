import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The design system's type scale lives in globals.css as custom `text-*`
 * utilities (see DESIGN.md's Named-Scale Rule). tailwind-merge has no way to
 * tell `text-body-md` from a colour like `text-white`, so out of the box it
 * treats them as the same class group and silently drops whichever came first
 * — e.g. the error Button losing `text-white` to `text-body-md`, or a Chip
 * losing `text-label-sm` to `text-primary`.
 *
 * Declaring them as font-size keeps colour and size in separate groups.
 * Any new step added to globals.css needs adding here too.
 */
const TYPE_SCALE = [
  "display-hero",
  "display-xxl",
  "display-xl",
  "display-lg",
  "display-md",
  "display-sm",
  "headline-lg",
  "headline-md",
  "headline-sm",
  "body-lg",
  "body-md",
  "body-sm",
  "body-sm-bold",
  "label-md",
  "label-sm",
];

const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: TYPE_SCALE }] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/[\s\-+]/g, "");
  // 10 digits, or 12 digits starting with 91 (Indian country code)
  return /^(91)?\d{10}$/.test(digits);
}
