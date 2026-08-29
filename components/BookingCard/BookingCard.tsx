"use client";

import Link from "next/link";
import {
  CalendarDays,
  Users,
  FileText,
  Clock,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import type { Booking, DocumentType } from "@/app/types/api";
import Button from "@/components/Button/Button";
import BookingStatusBadge from "@/components/BookingStatusBadge/BookingStatusBadge";
import Chip from "@/components/Chip/Chip";
import PendingDocumentsChip from "@/components/PendingDocumentsChip/PendingDocumentsChip";
import Stat from "@/components/Stat/Stat";
import { formatMonth, formatDate, formatSlug } from "@/lib/constants";

interface BookingCardProps {
  booking: Booking;
  /**
   * Document types already on the traveller's profile. Documents are stored per
   * user rather than per booking, so whether a booking's requirements are met
   * is a comparison against this list.
   */
  uploadedDocumentTypes?: DocumentType[];
  onReviewClick?: () => void;
}

export default function BookingCard({
  booking,
  uploadedDocumentTypes = [],
  onReviewClick,
}: BookingCardProps) {
  return (
    // The card is an <article>, not a <Link>: the review CTA is interactive and
    // an interactive element inside an <a> is invalid HTML. The title's link
    // stretches over the whole card via after:inset-0, so the card still reads
    // as one click target while the CTA sits above it on its own stacking level.
    <article className="group relative glass rounded-2xl border border-transparent p-6 flex flex-col gap-4 transition-colors hover:border-primary/30">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Chip variant="onSurface" icon={<MapPin className="h-3 w-3" />}>
              {formatSlug(booking.package.destinationSlug)}
            </Chip>

            <PendingDocumentsChip
              booking={booking}
              uploadedDocumentTypes={uploadedDocumentTypes}
            />
          </div>
          <h2 className="text-headline-sm text-text">
            <Link
              href={`/bookings/${booking.id}`}
              className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-primary/50 group-hover:text-primary transition-colors"
            >
              {booking.package.title}
            </Link>
          </h2>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <BookingStatusBadge status={booking.status} />
          <span className="text-label-sm text-text-subtle">#{booking.id}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-outline pt-4 md:grid-cols-4">
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
          label="Duration"
          value={`${booking.package.days} days`}
        />
        <Stat
          icon={<FileText className="w-4 h-4" />}
          label="Submitted"
          value={formatDate(booking.createdAt)}
        />
      </div>

      {booking.notes && (
        <p className="text-body-sm text-text-muted leading-relaxed line-clamp-2">
          {booking.notes}
        </p>
      )}

      {/* Review CTA — only once the trip is done */}
      {booking.status === "completed" && (
        <div className="border-t border-outline pt-4">
          {booking.hasReview ? (
            <div className="flex items-center gap-2 text-body-sm text-text-muted">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              Review submitted
            </div>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={onReviewClick}
              className="relative z-10"
            >
              Share Your Experience
            </Button>
          )}
        </div>
      )}
    </article>
  );
}
