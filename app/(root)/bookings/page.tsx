"use client";

import { useState } from "react";
import { useMyBookings } from "@/hooks/useMyBookings";
import { useSubmitReview } from "@/hooks/useSubmitReview";
import { reviewsApi } from "@/lib/endpoints";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorState from "@/components/ErrorState/ErrorState";
import Button from "@/components/Button/Button";
import EmptyState from "@/components/EmptyState/EmptyState";
import BookingCard from "@/components/BookingCard/BookingCard";
import ReviewModal from "@/components/ReviewModal/ReviewModal";
import ModalSuccess from "@/components/ModalSuccess/ModalSuccess";
import ModalError from "@/components/ModalError/ModalError";
import { CalendarDays } from "lucide-react";
import type { Booking } from "@/app/types/api";
import type { ReviewSubmitData } from "@/components/ReviewModal/ReviewModal";

export default function BookingsPage() {
  const { data: bookings, isLoading, isError, error, refetch } = useMyBookings();

  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);
  const [reviewSuccessOpen, setReviewSuccessOpen] = useState(false);
  const [reviewErrorOpen, setReviewErrorOpen] = useState(false);
  const [reviewErrorMsg, setReviewErrorMsg] = useState("");

  const { mutate, isPending, error: reviewError, reset: resetReview } = useSubmitReview(
    reviewingBooking?.package.destinationSlug ?? ""
  );

  function handleOpenReview(booking: Booking) {
    setReviewingBooking(booking);
  }

  function handleCloseReview() {
    setReviewingBooking(null);
  }

  async function handleReviewSubmit({ rating, quote, files }: ReviewSubmitData) {
    if (!reviewingBooking) return;

    mutate(
      { bookingId: reviewingBooking.id, rating, quote },
      {
        onSuccess: async (review) => {
          if (files.length > 0) {
            const formData = new FormData();
            files.forEach((f) => formData.append("files", f));
            try {
              await reviewsApi.uploadImages(review.id, formData);
            } catch {
              // Images failed but review was saved — show success anyway
            }
          }
          setReviewingBooking(null);
          setReviewSuccessOpen(true);
        },
        onError: (err) => {
          setReviewingBooking(null);
          setReviewErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
          setReviewErrorOpen(true);
        },
      }
    );
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading your travel interests…" fullScreen={false} />;
  }

  if (isError) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : undefined}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="pt-24 pb-16 px-6 md:px-10 max-w-(--container-max-w) mx-auto">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-display-sm text-text">My Bookings</h1>
        <p className="text-body-lg text-text-muted mt-2">
          Packages you&apos;ve expressed interest in. Our team will reach out
          to tailor each trip to your preferences.
        </p>
      </div>

      {/* Empty state */}
      {bookings?.length === 0 && (
        <EmptyState
          icon={<CalendarDays className="w-10 h-10 text-primary/50" strokeWidth={1.5} />}
          title="No booking interests yet"
          description="Browse packages and express your interest to get started."
          action={
            <Button variant="primary" href="/destinations">
              Explore Destinations
            </Button>
          }
        />
      )}

      {/* Booking list */}
      <div className="flex flex-col gap-4">
        {bookings?.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onReviewClick={() => handleOpenReview(booking)}
          />
        ))}
      </div>

      <ReviewModal
        isOpen={reviewingBooking !== null}
        onClose={handleCloseReview}
        packageTitle={reviewingBooking?.package.title ?? ""}
        isPending={isPending}
        error={reviewError instanceof Error ? reviewError : null}
        onSubmit={handleReviewSubmit}
      />

      <ModalSuccess
        isOpen={reviewSuccessOpen}
        title="Thank you for sharing!"
        message="Your review is pending approval and will appear shortly."
        onClose={() => setReviewSuccessOpen(false)}
      />

      <ModalError
        isOpen={reviewErrorOpen}
        title="Review Failed"
        message={reviewErrorMsg}
        onClose={() => { setReviewErrorOpen(false); resetReview(); }}
      />
    </div>
  );
}
