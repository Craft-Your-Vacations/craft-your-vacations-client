import { Clock, DollarSign, Users, CalendarDays, FileText } from "lucide-react";
import Surface from "@/components/Surface/Surface";
import { formatMonth } from "@/lib/constants";
import type { Booking } from "@/app/types/api";

interface BookingPackageDetailsProps {
  booking: Booking;
}

export default function BookingPackageDetails({
  booking,
}: BookingPackageDetailsProps) {
  return (
    <Surface className="gap-4">
      <h2 className="text-headline-sm text-text">Package Details</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary/70 shrink-0" />
          <div>
            <p className="text-label-sm text-text-muted uppercase tracking-widest">
              Duration
            </p>
            <p className="text-body-sm text-text">{booking.package.days} days</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary/70 shrink-0" />
          <div>
            <p className="text-label-sm text-text-muted uppercase tracking-widest">
              Starting from
            </p>
            <p className="text-body-sm text-text">
              ₹{booking.package.price.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary/70 shrink-0" />
          <div>
            <p className="text-label-sm text-text-muted uppercase tracking-widest">
              Travelers
            </p>
            <p className="text-body-sm text-text">{booking.travelersCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-primary/70 shrink-0" />
          <div>
            <p className="text-label-sm text-text-muted uppercase tracking-widest">
              Travel Date
            </p>
            <p className="text-body-sm text-text">
              {formatMonth(booking.travelDate)}
            </p>
          </div>
        </div>
      </div>
      {booking.package.excerpt && (
        <p className="text-body-sm text-text-muted leading-relaxed border-t border-outline pt-4">
          {booking.package.excerpt}
        </p>
      )}
      {booking.notes && (
        <div className="flex items-start gap-2 border-t border-outline pt-4">
          <FileText className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
          <p className="text-body-sm text-text-muted leading-relaxed">
            {booking.notes}
          </p>
        </div>
      )}
    </Surface>
  );
}
