"use client";

import Link from "next/link";
import { CalendarDays, Users, FileText, Clock, CheckCircle2 } from "lucide-react";
import type { Booking } from "@/app/types/api";
import Button from "@/components/Button/Button";
import { formatMonth, bookingStatusClasses, bookingStatusLabels } from "@/lib/constants";

interface BookingCardProps {
  booking: Booking;
  onReviewClick?: () => void;
}

export default function BookingCard({ booking, onReviewClick }: BookingCardProps) {
  const statusClass = bookingStatusClasses[booking.status];
  const statusLabel = bookingStatusLabels[booking.status];

  return (
    <Link href={`/bookings/${booking.id}`} className="block glass rounded-2xl p-6 flex flex-col gap-4 hover:border-primary/30 border border-transparent transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-headline-sm text-text">{booking.package.title}</h2>
        <span
          className={`shrink-0 px-3 py-1 rounded-full text-label-sm font-medium ${statusClass}`}
        >
          {statusLabel}
        </span>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
              Travel Month
            </p>
            <p className="text-body-sm text-text">
              {formatMonth(booking.preferredMonth)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary/70 shrink-0" />
          <div>
            <p className="text-label-sm text-text-muted uppercase tracking-widest">
              Submitted
            </p>
            <p className="text-body-sm text-text">
              {new Date(booking.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
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
            <Button variant="secondary" onClick={onReviewClick}>
              Share Your Experience
            </Button>
          )}
        </div>
      )}
    </Link>
  );
}
