"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Users,
  FileText,
  Clock,
  MapPin,
  ChevronLeft,
  DollarSign,
  ShieldCheck,
  X,
} from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { useUserDocuments } from "@/hooks/useUserDocuments";
import { useUploadDocument } from "@/hooks/useUploadDocument";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorState from "@/components/ErrorState/ErrorState";
import Surface from "@/components/Surface/Surface";
import ItineraryView from "@/components/ItineraryView/ItineraryView";
import DocumentUpload from "@/components/DocumentUpload/DocumentUpload";
import Dialog from "@/components/Dialog/Dialog";
import Button from "@/components/Button/Button";
import {
  formatMonth,
  bookingStatusClasses,
  bookingStatusLabels,
} from "@/lib/constants";
import type { DocumentType, UserDocument } from "@/app/types/api";

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
  const statusClass = bookingStatusClasses[booking.status];
  const statusLabel = bookingStatusLabels[booking.status];
  const docMap = Object.fromEntries((documents ?? []).map((d) => [d.type, d]));

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

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span
            className={`px-3 py-1 rounded-full text-label-sm font-medium ${statusClass}`}
          >
            {statusLabel}
          </span>
          <span className="text-label-sm text-text-muted">#{booking.id}</span>
        </div>
        <h1 className="text-display-sm text-text">{booking.package.title}</h1>
        <p className="text-body-md text-text-muted mt-1 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 shrink-0" />
          {booking.package.destinationSlug}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Package overview */}
        <Surface className="gap-4">
          <h2 className="text-headline-sm text-text">Package Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary/70 shrink-0" />
              <div>
                <p className="text-label-sm text-text-muted uppercase tracking-widest">
                  Duration
                </p>
                <p className="text-body-sm text-text">
                  {booking.package.days} days
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary/70 shrink-0" />
              <div>
                <p className="text-label-sm text-text-muted uppercase tracking-widest">
                  Starting from
                </p>
                <p className="text-body-sm text-text">
                  ₹{booking.package.price.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary/70 shrink-0" />
              <div>
                <p className="text-label-sm text-text-muted uppercase tracking-widest">
                  Travelers
                </p>
                <p className="text-body-sm text-text">
                  {booking.travelersCount}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary/70 shrink-0" />
              <div>
                <p className="text-label-sm text-text-muted uppercase tracking-widest">
                  Travel Date
                </p>
                <p className="text-body-sm text-text">
                  {formatMonth(booking.travelDate)}
                </p>
              </div>
            </div>
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

        {/* Confirmed itinerary */}
        {isConfirmed &&
          booking.confirmedItinerary &&
          booking.confirmedItinerary.length > 0 && (
            <Surface className="gap-4">
              <div>
                <h2 className="text-headline-sm text-text">Your Itinerary</h2>
                <p className="text-body-sm text-text-muted mt-1">
                  {booking.confirmedItinerary.length} days · customised for your
                  trip
                </p>
              </div>
              <ItineraryView itinerary={booking.confirmedItinerary} />
            </Surface>
          )}

        {/* Required documents */}
        {isConfirmed &&
          booking.requiredDocuments &&
          booking.requiredDocuments.length > 0 && (
            <Surface className="gap-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-headline-sm text-text">
                    Required Documents
                  </h2>
                  <p className="text-body-sm text-text-muted mt-1">
                    Documents you upload are saved to your profile and reused
                    for future trips.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {booking.requiredDocuments.map((docType) => (
                  <DocumentUpload
                    key={docType}
                    type={docType}
                    label={DOCUMENT_LABELS[docType]}
                    existingDocument={docMap[docType]}
                    onUpload={handleUpload}
                    onView={setViewDoc}
                    isUploading={isUploading && uploadingVars?.type === docType}
                  />
                ))}
              </div>
            </Surface>
          )}
      </div>

      <Dialog
        isOpen={viewDoc !== null}
        onClose={() => setViewDoc(null)}
        ariaLabel="View document"
        size="lg"
        className="max-w-3xl p-0 overflow-hidden"
      >
        {viewDoc && (
          <>
            <div className="flex items-center justify-between px-5 py-4 border-b border-outline">
              <span className="text-headline-sm text-text">
                {DOCUMENT_LABELS[viewDoc.type]}
              </span>
              <Button
                variant="icon"
                size="sm"
                onClick={() => setViewDoc(null)}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="h-[70vh]">
              <iframe
                src={viewDoc.fileUrl}
                className="w-full h-full"
                title={DOCUMENT_LABELS[viewDoc.type]}
              />
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}
