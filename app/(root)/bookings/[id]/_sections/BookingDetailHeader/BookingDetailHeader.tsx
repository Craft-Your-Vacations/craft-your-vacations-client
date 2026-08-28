import { MapPin } from "lucide-react";
import BookingStatusBadge from "@/components/BookingStatusBadge/BookingStatusBadge";
import type { Booking } from "@/app/types/api";

interface BookingDetailHeaderProps {
  booking: Booking;
}

export default function BookingDetailHeader({
  booking,
}: BookingDetailHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <BookingStatusBadge status={booking.status} />
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
