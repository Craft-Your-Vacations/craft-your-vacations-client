"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { useUserDocuments } from "@/hooks/useUserDocuments";
import { useUploadDocument } from "@/hooks/useUploadDocument";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorState from "@/components/ErrorState/ErrorState";
import DocumentViewerDialog from "@/components/DocumentViewerDialog/DocumentViewerDialog";
import type { DocumentType, UserDocument } from "@/app/types/api";
import BookingDetailHeader from "./_sections/BookingDetailHeader/BookingDetailHeader";
import BookingPackageDetails from "./_sections/BookingPackageDetails/BookingPackageDetails";
import BookingItinerary from "./_sections/BookingItinerary/BookingItinerary";
import RequiredDocuments from "./_sections/RequiredDocuments/RequiredDocuments";

const DOCUMENT_LABELS: Record<DocumentType, string> = {
  passport: "Passport",
  pan: "PAN Surface",
};

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
  const {
    mutate: uploadDocument,
    isPending: isUploading,
    variables: uploadingVars,
  } = useUploadDocument();

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
    <div className="pt-24 pb-16 px-6 md:px-10 max-w-(--container-max-w) mx-auto">
      {/* Back link */}
      <Link
        href="/bookings"
        className="inline-flex items-center gap-1.5 text-body-sm text-text-muted hover:text-primary transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to bookings
      </Link>

      <BookingDetailHeader booking={booking} />

      <div className="flex flex-col gap-6">
        <BookingPackageDetails booking={booking} />
        <BookingItinerary
          itinerary={booking.confirmedItinerary}
          isConfirmed={isConfirmed}
        />
        <RequiredDocuments
          isConfirmed={isConfirmed}
          requiredDocuments={booking.requiredDocuments ?? []}
          documents={documents}
          labels={DOCUMENT_LABELS}
          onUpload={handleUpload}
          onView={setViewDoc}
          isUploading={isUploading}
          uploadingType={uploadingVars?.type}
        />
      </div>

      <DocumentViewerDialog
        isOpen={viewDoc !== null}
        onClose={() => setViewDoc(null)}
        document={viewDoc}
        label={viewDoc ? DOCUMENT_LABELS[viewDoc.type] : ""}
      />
    </div>
  );
}
