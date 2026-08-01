"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import FormField from "@/components/FormField/FormField";
import TextAreaField from "@/components/TextAreaField/TextAreaField";
import Button from "@/components/Button/Button";
import Dialog from "@/components/Dialog/Dialog";
import { bookingSchema } from "@/lib/validation/schemas";
import { getFieldErrors } from "@/lib/validation/getFieldErrors";
import { LIMITS } from "@/lib/validation/limits";

export interface BookingSubmitData {
  travelersCount: number;
  travelDate: string;
  notes?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageTitle: string;
  isPending: boolean;
  error: Error | null;
  onSubmit: (data: BookingSubmitData) => void;
}

export function BookingModal({
  isOpen,
  onClose,
  packageTitle,
  isPending,
  error,
  onSubmit,
}: BookingModalProps) {
  const [travelersCount, setTravelersCount] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setTravelersCount("");
        setTravelDate("");
        setNotes("");
        setErrors({});
      }, 200);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fieldErrors = getFieldErrors(bookingSchema, {
      travelersCount,
      travelDate,
      notes,
    });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    onSubmit({
      travelersCount: parseInt(travelersCount, 10),
      travelDate,
      notes: notes.trim() || undefined,
    });
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} ariaLabel={`Book ${packageTitle}`} size="lg" className="gap-6">
      {/* Close button */}
      <Button
        variant="icon"
        size="sm"
        onClick={onClose}
        className="absolute top-5 right-5"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </Button>

      <div>
        <h2 className="text-headline-md text-text">{packageTitle}</h2>
        <p className="text-body-md text-text-muted mt-2">
          Share your interest and our team will reach out to plan your
          perfect trip.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormField
          id="travelers"
          label="Number of travelers"
          type="number"
          required
          placeholder="e.g. 2"
          min={LIMITS.travelersMin}
          max={LIMITS.travelersMax}
          value={travelersCount}
          onChange={(e) => setTravelersCount(e.target.value)}
          errorMessage={errors.travelersCount}
        />
        <FormField
          id="preferredDate"
          label="Preferred travel date"
          type="date"
          required
          value={travelDate}
          onChange={(e) => setTravelDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          errorMessage={errors.travelDate}
        />
        <TextAreaField
          id="notes"
          label="Additional notes"
          placeholder="Any special requests, dietary needs, anniversary celebrations…"
          rows={3}
          maxLength={LIMITS.notesMax}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          errorMessage={errors.notes}
        />

        {error && (
          <p className="text-body-sm text-error">
            {error.message || "Something went wrong. Please try again."}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          loading={isPending}
          className="w-full justify-center mt-2"
        >
          Express Interest
        </Button>
      </form>
    </Dialog>
  );
}

export default BookingModal;
