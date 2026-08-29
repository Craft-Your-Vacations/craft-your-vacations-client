import type { BookingStatus, ActivityType, DocumentType } from "@/app/types/api";

export const BOOKING_STATUSES: BookingStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

export const ACTIVITY_TYPES: ActivityType[] = [
  "transport",
  "leisure",
  "sightseeing",
  "dining",
  "cultural",
  "adventure",
];

export const MONTH_NAMES_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const MONTH_NAMES_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatMonth(value: string, short = false): string {
  const parts = value.split("-");
  if (parts.length === 3) {
    // Full date: "YYYY-MM-DD"
    return new Date(value + "T00:00:00").toLocaleDateString("en-US", {
      day: "numeric",
      month: short ? "short" : "long",
      year: "numeric",
    });
  }
  // Legacy month-only: "YYYY-MM"
  const names = short ? MONTH_NAMES_SHORT : MONTH_NAMES_FULL;
  return `${names[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
}

// Formats an ISO timestamp/date string as a short date, e.g. "7 Aug 2026".
export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** "hong-kong" -> "Hong Kong". For slugs surfaced in customer-facing copy. */
export function formatSlug(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Customer-facing name for each document type. */
export const DOCUMENT_LABELS: Record<DocumentType, string> = {
  passport: "Passport",
  pan: "PAN Card",
};

export const DOCUMENT_OPTIONS: { value: DocumentType; label: string }[] = [
  { value: "passport", label: DOCUMENT_LABELS.passport },
  { value: "pan", label: DOCUMENT_LABELS.pan },
];

/** Tailwind classes for each booking status — used in badges/pills */
export const bookingStatusClasses: Record<BookingStatus, string> = {
  pending: "bg-warning/10 text-warning",
  confirmed: "bg-success/10 text-success",
  completed: "bg-primary/10 text-primary",
  cancelled: "bg-error/10 text-error",
};

export const REVIEW_TABS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
];

/** Customer-facing display labels for each booking status */
export const bookingStatusLabels: Record<BookingStatus, string> = {
  pending: "Pending Review",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};
