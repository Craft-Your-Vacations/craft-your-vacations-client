"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useAdminBookingDetail } from "@/hooks/useAdminBookingDetail";
import { useAdminUpdateBooking } from "@/hooks/useAdminUpdateBooking";
import { usePackageDetail } from "@/hooks/usePackageDetail";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorState from "@/components/ErrorState/ErrorState";
import Button from "@/components/Button/Button";
import Surface from "@/components/Surface/Surface";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import FormField from "@/components/FormField/FormField";
import TextAreaField from "@/components/TextAreaField/TextAreaField";
import SelectField from "@/components/SelectField/SelectField";
import { CalendarDays, Users, FileText, Phone, Mail, Globe } from "lucide-react";
import type { BookingStatus, ItineraryDay, DocumentType } from "@/app/types/api";
import BackButton from "@/components/BackButton/BackButton";
import BookingStatusBadge, { formatMonth } from "@/app/(admin)/components/BookingStatusBadge";
import ItineraryEditor from "@/app/(admin)/components/ItineraryEditor/ItineraryEditor";
import RequiredDocumentsSelector from "@/app/(admin)/components/RequiredDocumentsSelector/RequiredDocumentsSelector";
import { BOOKING_STATUSES } from "@/lib/constants";
import { LIMITS } from "@/lib/validation/limits";
import { useToastStore } from "@/stores/useToastStore";

export default function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: booking, isLoading, isError, error, refetch } = useAdminBookingDetail(Number(id));
  const updateBooking = useAdminUpdateBooking(Number(id));
  const { data: packageDetail } = usePackageDetail(
    booking?.package.destinationSlug ?? "",
    booking?.package.key ?? ""
  );

  const [editStatus, setEditStatus] = useState<BookingStatus | "">("");
  const [editNotes, setEditNotes] = useState("");
  const [editTravelers, setEditTravelers] = useState("");
  const [editDate, setEditDate] = useState("");
  const [requiredDocs, setRequiredDocs] = useState<DocumentType[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const addToast = useToastStore((s) => s.addToast);

  // Pre-populate required docs once when booking loads
  useEffect(() => {
    if (!booking) return;
    setRequiredDocs(booking.requiredDocuments ?? []);
    // If a confirmed itinerary already exists, seed from it immediately
    if (booking.confirmedItinerary?.length) {
      setItinerary(booking.confirmedItinerary);
    }
  }, [booking]);

  // Seed itinerary from original package only when there is no confirmed itinerary yet
  useEffect(() => {
    if (!packageDetail?.itinerary?.length) return;
    setItinerary((prev) => (prev.length === 0 ? packageDetail.itinerary : prev));
  }, [packageDetail]);

  if (isLoading) return <LoadingSpinner message="Loading booking…" fullScreen={false} />;
  if (isError)
    return (
      <ErrorState message={error instanceof Error ? error.message : undefined} onRetry={refetch} />
    );
  if (!booking)
    return (
      <div className="p-8">
        <p className="text-body-md text-text-muted">Booking not found.</p>
      </div>
    );

  const showConfirmFields =
    editStatus === "confirmed" || booking.status === "confirmed" || booking.status === "completed";

  // --- Save ---
  function handleSave() {
    const hasBasicChange =
      editStatus !== "" || editNotes !== "" || editTravelers !== "" || editDate !== "";
    if (!hasBasicChange && !showConfirmFields) return;

    // Validate only the fields being changed (this is a partial patch).
    const fieldErrors: Record<string, string> = {};
    if (editTravelers) {
      const n = Number(editTravelers);
      if (!Number.isInteger(n) || n < LIMITS.travelersMin || n > LIMITS.travelersMax)
        fieldErrors.travelers = `Travelers must be between ${LIMITS.travelersMin} and ${LIMITS.travelersMax}.`;
    }
    if (editNotes && editNotes.length > LIMITS.notesMax)
      fieldErrors.notes = `Notes must be at most ${LIMITS.notesMax} characters.`;
    if (editDate && Number.isNaN(Date.parse(editDate)))
      fieldErrors.date = "Please select a valid date.";
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setConfirmOpen(true);
  }

  function handleConfirmSave() {
    const body: Parameters<typeof updateBooking.mutate>[0] = {};
    if (editStatus) body.status = editStatus;
    if (editNotes) body.notes = editNotes;
    // Travelers already validated in handleSave before opening the confirm dialog.
    if (editTravelers) body.travelersCount = Number(editTravelers);
    if (editDate) body.travelDate = editDate;
    if (showConfirmFields) {
      body.requiredDocuments = requiredDocs;
      body.confirmedItinerary = itinerary;
    }

    updateBooking.mutate(body, {
      onSuccess: () => {
        setEditStatus("");
        setEditNotes("");
        setEditTravelers("");
        setEditDate("");
        setConfirmOpen(false);
        addToast({ key: "update-booking", type: "success", message: "Booking updated successfully" });
      },
      onError: (err) => {
        addToast({ key: "update-booking", type: "error", message: err instanceof Error ? err.message : "Failed to save" });
      },
    });
  }

  const canSave =
    editStatus !== "" ||
    editNotes !== "" ||
    editTravelers !== "" ||
    editDate !== "" ||
    showConfirmFields;

  return (
    <div className="p-8 max-w-4xl">
      <BackButton className="mb-6" />

      <div className="mb-6">
        <h1 className="text-display-sm text-text">{booking.package.title}</h1>
        <p className="text-body-md text-text-muted mt-1">{booking.package.destinationSlug}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Booking details */}
        <Surface>
          <h2 className="text-headline-sm text-text">Booking Details</h2>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <BookingStatusBadge status={booking.status} />
              <span className="text-label-sm text-text-muted">
                #{booking.id} ·{" "}
                {new Date(booking.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary/60 shrink-0" />
              <div>
                <p className="text-label-sm text-text-muted uppercase tracking-widest">
                  Travel Date
                </p>
                <p className="text-body-sm text-text">{formatMonth(booking.travelDate)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary/60 shrink-0" />
              <div>
                <p className="text-label-sm text-text-muted uppercase tracking-widest">Travelers</p>
                <p className="text-body-sm text-text">{booking.travelersCount}</p>
              </div>
            </div>

            {booking.notes && (
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-primary/60 shrink-0 mt-0.5" />
                <div>
                  <p className="text-label-sm text-text-muted uppercase tracking-widest">Notes</p>
                  <p className="text-body-sm text-text leading-relaxed">{booking.notes}</p>
                </div>
              </div>
            )}
          </div>
        </Surface>

        {/* Customer details */}
        <Surface>
          <div className="flex items-center justify-between">
            <h2 className="text-headline-sm text-text">Customer</h2>
            <Link
              href={`/admin/customers/${booking.customer.id}`}
              className="text-body-sm text-primary hover:underline"
            >
              View profile
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-headline-sm text-text">{booking.customer.name}</p>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary/60 shrink-0" />
              <p className="text-body-sm text-text">{booking.customer.email}</p>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary/60 shrink-0" />
              <p className="text-body-sm text-text">{booking.customer.mobileNumber}</p>
            </div>

            {booking.customer.nationality && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary/60 shrink-0" />
                <p className="text-body-sm text-text">{booking.customer.nationality}</p>
              </div>
            )}

            {booking.customer.profession && (
              <p className="text-body-sm text-text-muted">{booking.customer.profession}</p>
            )}
          </div>
        </Surface>

        {/* Update booking */}
        <Surface className="md:col-span-2">
          <h2 className="text-headline-sm text-text">Update Booking</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              id="booking-status"
              label="Change Status"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as BookingStatus | "")}
              options={[
                { value: "", label: `Keep current (${booking.status})` },
                ...BOOKING_STATUSES.map((s) => ({ value: s, label: s })),
              ]}
            />

            <FormField
              id="booking-travelers"
              label="Travelers Count"
              type="number"
              placeholder={String(booking.travelersCount)}
              value={editTravelers}
              onChange={(e) => setEditTravelers(e.target.value)}
              min={LIMITS.travelersMin}
              max={LIMITS.travelersMax}
              errorMessage={errors.travelers}
            />

            <FormField
              id="booking-month"
              label="Preferred Date"
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              errorMessage={errors.date}
            />

            <TextAreaField
              id="booking-notes"
              label="Notes"
              placeholder={booking.notes ?? "Add or update notes…"}
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              rows={3}
              maxLength={LIMITS.notesMax}
              className="md:col-span-2"
              errorMessage={errors.notes}
            />
          </div>

          {/* Confirmation fields — shown when setting/editing confirmed status */}
          {showConfirmFields && (
            <>
              <div className="h-px bg-outline" />

              <RequiredDocumentsSelector value={requiredDocs} onChange={setRequiredDocs} />

              <div className="h-px bg-outline" />

              <ItineraryEditor itinerary={itinerary} onChange={setItinerary} />
            </>
          )}

          <div className="flex items-center gap-4 pt-2">
            <Button
              variant="primary"
              onClick={handleSave}
              loading={updateBooking.isPending}
              disabled={!canSave}
            >
              Save Changes
            </Button>
          </div>

          <ConfirmDialog
            isOpen={confirmOpen}
            title="Save booking changes?"
            message="This will update the booking details. The customer will not be notified automatically."
            confirmLabel="Yes, save"
            variant="warning"
            isPending={updateBooking.isPending}
            onConfirm={handleConfirmSave}
            onCancel={() => setConfirmOpen(false)}
          />
        </Surface>
      </div>
    </div>
  );
}
