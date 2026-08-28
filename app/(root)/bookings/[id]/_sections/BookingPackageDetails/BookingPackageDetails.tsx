import { Clock, DollarSign, Users, CalendarDays, FileText } from "lucide-react";
import Surface from "@/components/Surface/Surface";
import Stat from "@/components/Stat/Stat";
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
        <Stat
          icon={<Clock className="w-4 h-4" />}
          label="Duration"
          value={`${booking.package.days} days`}
        />
        <Stat
          icon={<DollarSign className="w-4 h-4" />}
          label="Starting from"
          value={`₹${booking.package.price.toLocaleString()}`}
        />
        <Stat
          icon={<Users className="w-4 h-4" />}
          label="Travelers"
          value={booking.travelersCount}
        />
        <Stat
          icon={<CalendarDays className="w-4 h-4" />}
          label="Travel Date"
          value={formatMonth(booking.travelDate)}
        />
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
