import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, MapPin } from "lucide-react";
import Chip from "@/components/Chip/Chip";
import BookingStatusBadge from "@/components/BookingStatusBadge/BookingStatusBadge";
import PendingDocumentsChip from "@/components/PendingDocumentsChip/PendingDocumentsChip";
import { formatSlug } from "@/lib/constants";
import type { Booking, Destination, DocumentType } from "@/app/types/api";

interface BookingDetailHeaderProps {
  booking: Booking;
  uploadedDocumentTypes?: DocumentType[];
  /** The booked destination — supplies the ambient backdrop. Undefined while it loads. */
  destination?: Destination;
}

export default function BookingDetailHeader({
  booking,
  uploadedDocumentTypes,
  destination,
}: BookingDetailHeaderProps) {
  const destinationName =
    destination?.title ?? formatSlug(booking.package.destinationSlug);

  return (
    <header className="relative overflow-hidden pt-28 md:pt-32">
      {/* Ambient destination photography behind the opener — no hero, no block
          to lay out; it just tints the header and dissolves into the page.
          inset-0 (not a fixed height) so the fade always finishes at the
          header's own edge instead of being clipped into a seam. */}
      {destination?.imagePath && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <Image
            src={destination.imagePath}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Scrim + fade live in the `photo-wash` utility because the two
              themes need opposite gradient shapes — see globals.css. */}
          <div className="photo-wash absolute inset-0" />
        </div>
      )}

      <div className="relative z-10 mx-auto flex max-w-(--container-max-w) flex-col gap-5 px-6 md:px-10">
        <Link
          href="/bookings"
          className="inline-flex w-fit items-center gap-1.5 text-body-sm text-text-muted transition-colors hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" />
          Back to bookings
        </Link>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          <BookingStatusBadge status={booking.status} />

          {/* The destination pill carries the link back to the catalogue that
              the photo card used to provide. */}
          <Link href={`/destinations/${booking.package.destinationSlug}`}>
            <Chip variant="onSurface" icon={<MapPin className="h-3 w-3" />}>
              {destinationName}
            </Chip>
          </Link>

          <PendingDocumentsChip
            booking={booking}
            uploadedDocumentTypes={uploadedDocumentTypes}
          />

          <span className="text-label-md text-text-subtle">#{booking.id}</span>
        </div>

        <h1 className="max-w-3xl text-display-sm md:text-display-md text-text tracking-tighter leading-tight">
          {booking.package.title}
        </h1>

        {booking.package.excerpt && (
          <p className="max-w-2xl text-body-lg text-text-muted leading-relaxed font-light">
            {booking.package.excerpt}
          </p>
        )}
      </div>
    </header>
  );
}
