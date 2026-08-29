import type { BookingStatus } from "@/app/types/api";
import { bookingStatusClasses, bookingStatusLabels } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

// The single source of truth for the booking-status pill (admin + customer).
export default function BookingStatusBadge({
  status,
  className = "",
}: BookingStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-label-sm font-medium",
        bookingStatusClasses[status],
        className,
      )}
    >
      {bookingStatusLabels[status]}
    </span>
  );
}
