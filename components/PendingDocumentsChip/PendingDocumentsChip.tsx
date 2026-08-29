import { FileWarning } from "lucide-react";
import Chip from "@/components/Chip/Chip";
import { DOCUMENT_LABELS } from "@/lib/constants";
import type { Booking, DocumentType } from "@/app/types/api";

interface PendingDocumentsChipProps {
  booking: Booking;
  /**
   * Document types already on the traveller's profile. Documents are stored per
   * user rather than per booking, so "is this booking's paperwork done?" is a
   * comparison against this list.
   */
  uploadedDocumentTypes?: DocumentType[];
}

// Renders nothing unless the booking has outstanding paperwork. Documents are
// only requested once a booking is confirmed, so that is the only state worth
// chasing — nagging about a completed trip's paperwork helps nobody.
export default function PendingDocumentsChip({
  booking,
  uploadedDocumentTypes = [],
}: PendingDocumentsChipProps) {
  const pending =
    booking.status === "confirmed"
      ? (booking.requiredDocuments ?? []).filter(
          (type) => !uploadedDocumentTypes.includes(type),
        )
      : [];

  if (pending.length === 0) return null;

  return (
    <Chip variant="warning" icon={<FileWarning className="h-3 w-3" />}>
      {pending.length === 1
        ? `${DOCUMENT_LABELS[pending[0]]} pending`
        : `${pending.length} documents pending`}
    </Chip>
  );
}
