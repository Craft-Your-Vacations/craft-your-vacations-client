import { MapPin } from "lucide-react";
import { bookingStatusClasses, bookingStatusLabels } from "@/lib/constants";
import type { Booking } from "@/app/types/api";

interface BookingDetailHeaderProps {
  booking: Booking;
}

export default function BookingDetailHeader({
  booking,
}: BookingDetailHeaderProps) {
  const statusClass = bookingStatusClasses[booking.status];
  const statusLabel = bookingStatusLabels[booking.status];

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <span
          className={`px-3 py-1 rounded-full text-label-sm font-medium ${statusClass}`}
        >
          {statusLabel}
        </span>
        <span className="text-label-sm text-text-muted">#{booking.id}</span>
      </div>
      <h1 className="text-display-sm text-text">{booking.package.title}</h1>
      <p className="text-body-md text-text-muted mt-1 flex items-center gap-1.5">
        <MapPin className="w-4 h-4 shrink-0" />
        {booking.package.destinationSlug}
      </p>
    </div>
  );
}
