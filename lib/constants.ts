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
  const [year, month] = value.split("-");
  const names = short ? MONTH_NAMES_SHORT : MONTH_NAMES_FULL;
  return `${names[parseInt(month, 10) - 1]} ${year}`;
}

export const DOCUMENT_OPTIONS: { value: DocumentType; label: string }[] = [
  { value: "passport", label: "Passport" },
  { value: "pan", label: "PAN Card" },
];

/** Tailwind classes for each booking status — used in badges/pills */
export const bookingStatusClasses: Record<BookingStatus, string> = {
  pending: "bg-primary/15 text-primary",
  confirmed: "bg-green-500/15 text-green-400",
  completed: "bg-primary/10 text-primary/70",
  cancelled: "bg-red-500/15 text-red-400",
};

/** Customer-facing display labels for each booking status */
export const bookingStatusLabels: Record<BookingStatus, string> = {
  pending: "Pending Review",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};
