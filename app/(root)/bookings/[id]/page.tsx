"use client";

import { use, useMemo, useState } from "react";
import { useBooking } from "@/hooks/useBooking";
import { useDestinations } from "@/hooks/useDestinations";
import { useUserDocuments } from "@/hooks/useUserDocuments";
import { useUploadDocument } from "@/hooks/useUploadDocument";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorState from "@/components/ErrorState/ErrorState";
import CtaBanner from "@/components/CtaBanner/CtaBanner";
import Reveal from "@/components/motion/Reveal";
import DocumentViewerDialog from "@/components/DocumentViewerDialog/DocumentViewerDialog";
import { DOCUMENT_LABELS } from "@/lib/constants";
import type { DocumentType, UserDocument } from "@/app/types/api";
import BookingDetailHeader from "./_sections/BookingDetailHeader/BookingDetailHeader";
import BookingProgress from "./_sections/BookingProgress/BookingProgress";
import BookingPackageDetails from "./_sections/BookingPackageDetails/BookingPackageDetails";
import BookingItinerary from "./_sections/BookingItinerary/BookingItinerary";
import RequiredDocuments from "./_sections/RequiredDocuments/RequiredDocuments";

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const bookingId = Number(id);

  const [viewDoc, setViewDoc] = useState<UserDocument | null>(null);

  const {
    data: booking,
    isLoading,
    isError,
    error,
    refetch,
  } = useBooking(bookingId);
  const { data: documents } = useUserDocuments();
  // The listing payload already carries the photo, title and cities we need for
  // the header card, and it is usually warm in the cache from browsing.
  const { data: destinations } = useDestinations();
  const {
    mutate: uploadDocument,
    isPending: isUploading,
    variables: uploadingVars,
  } = useUploadDocument();

  const uploadedDocumentTypes = useMemo(
    () => (documents ?? []).map((d) => d.type),
    [documents],
  );

  const destination = useMemo(
    () => destinations?.find((d) => d.slug === booking?.package.destinationSlug),
    [destinations, booking?.package.destinationSlug],
  );

  function handleUpload(type: DocumentType, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    uploadDocument({ type, formData });
  }

  if (isLoading)
    return <LoadingSpinner message="Loading booking…" fullScreen={false} />;
  if (isError)
    return (
      <ErrorState
        message={error instanceof Error ? error.message : undefined}
        onRetry={refetch}
      />
    );
  if (!booking) return <ErrorState title="Booking not found" />;

  const isConfirmed =
    booking.status === "confirmed" || booking.status === "completed";

  return (
    // The header owns its own top padding so its backdrop can bleed up behind
    // the fixed navbar.
    <div>
      <BookingDetailHeader
        booking={booking}
        uploadedDocumentTypes={uploadedDocumentTypes}
        destination={destination}
      />

      <BookingProgress
        booking={booking}
        uploadedDocumentTypes={uploadedDocumentTypes}
      />

      <Reveal>
        <BookingPackageDetails booking={booking} />
      </Reveal>

      <Reveal>
        <BookingItinerary
          itinerary={booking.confirmedItinerary}
          isConfirmed={isConfirmed}
        />
      </Reveal>

      <Reveal>
        <RequiredDocuments
          isConfirmed={isConfirmed}
          requiredDocuments={booking.requiredDocuments ?? []}
          documents={documents}
          onUpload={handleUpload}
          onView={setViewDoc}
          isUploading={isUploading}
          uploadingType={uploadingVars?.type}
        />
      </Reveal>

      <CtaBanner
        heading="Questions about this trip?"
        subtext="Our team is a message away — we'll tailor every detail with you before anything is confirmed."
      />

      <DocumentViewerDialog
        isOpen={viewDoc !== null}
        onClose={() => setViewDoc(null)}
        document={viewDoc}
        label={viewDoc ? DOCUMENT_LABELS[viewDoc.type] : ""}
      />
    </div>
  );
}
