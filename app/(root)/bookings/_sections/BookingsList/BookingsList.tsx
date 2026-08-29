import BookingCard from "@/components/BookingCard/BookingCard";
import Reveal from "@/components/motion/Reveal";
import type { Booking, DocumentType } from "@/app/types/api";

interface BookingsListProps {
  bookings: Booking[];
  /** Document types already on the traveller's profile (see BookingCard). */
  uploadedDocumentTypes: DocumentType[];
  onReviewClick: (booking: Booking) => void;
}

export default function BookingsList({
  bookings,
  uploadedDocumentTypes,
  onReviewClick,
}: BookingsListProps) {
  return (
    <div className="flex flex-col gap-4">
      {bookings.map((booking) => (
        <Reveal key={booking.id}>
          <BookingCard
            booking={booking}
            uploadedDocumentTypes={uploadedDocumentTypes}
            onReviewClick={() => onReviewClick(booking)}
          />
        </Reveal>
      ))}
    </div>
  );
}
