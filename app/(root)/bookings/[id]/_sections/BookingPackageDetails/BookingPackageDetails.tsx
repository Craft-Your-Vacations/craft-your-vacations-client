import { Clock, IndianRupee, Users, CalendarDays, FileText } from "lucide-react";
import Section from "@/components/Section/Sections";
import Surface from "@/components/Surface/Surface";
import Stat from "@/components/Stat/Stat";
import { formatMonth, formatDate } from "@/lib/constants";
import type { Booking } from "@/app/types/api";

interface BookingPackageDetailsProps {
  booking: Booking;
}

export default function BookingPackageDetails({
  booking,
}: BookingPackageDetailsProps) {
  return (
    <Section id="details" title="">
      <div className="mb-8">
        <h2 className="text-headline-lg text-text">Booking details</h2>
        <p className="text-body-md text-text-muted mt-1">
          Requested on {formatDate(booking.createdAt)}
        </p>
      </div>

      <Surface className="gap-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat
            icon={<Clock className="w-4 h-4" />}
            label="Duration"
            value={`${booking.package.days} days`}
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
          <Stat
            icon={<IndianRupee className="w-4 h-4" />}
            label="Starting from"
            value={`₹${booking.package.price.toLocaleString()}`}
          />
        </div>

        {booking.notes && (
          <div className="flex items-start gap-2 border-t border-outline pt-5">
            <FileText className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
            <div>
              <p className="text-label-sm text-text-muted uppercase tracking-widest">
                Your notes
              </p>
              <p className="text-body-sm text-text-muted leading-relaxed mt-1">
                {booking.notes}
              </p>
            </div>
          </div>
        )}
      </Surface>
    </Section>
  );
}
