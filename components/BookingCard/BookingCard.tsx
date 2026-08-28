"use client";

import Link from "next/link";
import { CalendarDays, Users, FileText, Clock, CheckCircle2 } from "lucide-react";
import type { Booking } from "@/app/types/api";
import Button from "@/components/Button/Button";
import BookingStatusBadge from "@/components/BookingStatusBadge/BookingStatusBadge";
import Stat from "@/components/Stat/Stat";
import { formatMonth, formatDate } from "@/lib/constants";

interface BookingCardProps {
  booking: Booking;
  onReviewClick?: () => void;
}

export default function BookingCard({ booking, onReviewClick }: BookingCardProps) {
  return (
    <Link href={`/bookings/${booking.id}`} className="block glass rounded-2xl p-6 flex flex-col gap-4 hover:border-primary/30 border border-transparent transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-headline-sm text-text">{booking.package.title}</h2>
        <BookingStatusBadge status={booking.status} className="shrink-0" />
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
          icon={<Clock className="w-4 h-4" />}
          label="Submitted"
          value={formatDate(booking.createdAt)}
        />
      </div>

      {/* Notes */}
      {booking.notes && (
        <div className="flex items-start gap-2 pt-2 border-t border-outline">
          <FileText className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
          <p className="text-body-sm text-text-muted leading-relaxed">
            {booking.notes}
          </p>
        </div>
      )}

      {/* Review CTA — only for completed bookings */}
      {booking.status === "completed" && (
        <div className="flex items-center justify-between pt-2 border-t border-outline">
          {booking.hasReview ? (
            <div className="flex items-center gap-2 text-body-sm text-text-muted">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              Review submitted
            </div>
          ) : (
            <Button variant="secondary" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onReviewClick?.(); }}>
              Share Your Experience
            </Button>
          )}
        </div>
      )}
    </Link>
  );
}
