"use client";

import { useMemo, useState } from "react";
import { CalendarDays, PlaneTakeoff, History } from "lucide-react";
import { useMyBookings } from "@/hooks/useMyBookings";
import { useUserDocuments } from "@/hooks/useUserDocuments";
import { useSubmitReview } from "@/hooks/useSubmitReview";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorState from "@/components/ErrorState/ErrorState";
import Button from "@/components/Button/Button";
import EmptyState from "@/components/EmptyState/EmptyState";
import CtaBanner from "@/components/CtaBanner/CtaBanner";
import ReviewModal from "@/components/ReviewModal/ReviewModal";
import ModalSuccess from "@/components/ModalSuccess/ModalSuccess";
import ModalError from "@/components/ModalError/ModalError";
import BookingsHero from "./_sections/BookingsHero/BookingsHero";
import BookingsToolbar, {
  type BookingTab,
} from "./_sections/BookingsToolbar/BookingsToolbar";
import BookingsList from "./_sections/BookingsList/BookingsList";
import type { Booking } from "@/app/types/api";
import type { ReviewSubmitData } from "@/components/ReviewModal/ReviewModal";

// travelDate is either "YYYY-MM" or "YYYY-MM-DD"; both sort correctly as plain
// strings, and mixing the two still orders by month, which is all we need.
const byTravelDate = (a: Booking, b: Booking) =>
  a.travelDate.localeCompare(b.travelDate);

export default function BookingsPage() {
  const { data: bookings, isLoading, isError, error, refetch } = useMyBookings();
  // Documents live on the profile, not the booking, so one fetch covers the
  // whole list. The card compares each booking's requirements against it.
  const { data: documents } = useUserDocuments();

  const [tab, setTab] = useState<BookingTab>("upcoming");
  const [tabSeeded, setTabSeeded] = useState(false);
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

  function handleReviewSubmit({ rating, quote, files }: ReviewSubmitData) {
    if (!reviewingBooking) return;

    mutate(
      { bookingId: reviewingBooking.id, rating, quote, files },
      {
        onSuccess: () => {
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

  const list = useMemo(() => bookings ?? [], [bookings]);

  const uploadedDocumentTypes = useMemo(
    () => (documents ?? []).map((d) => d.type),
    [documents],
  );

  const upcoming = useMemo(
    () =>
      list
        .filter((b) => b.status === "pending" || b.status === "confirmed")
        .sort(byTravelDate),
    [list],
  );

  // Past trips read best newest-first.
  const past = useMemo(
    () =>
      list
        .filter((b) => b.status === "completed" || b.status === "cancelled")
        .sort((a, b) => byTravelDate(b, a)),
    [list],
  );

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

  const visible = tab === "upcoming" ? upcoming : past;

  // Land on the tab that actually has something in it. Seeded during render on
  // the first resolved payload (an effect here would trip set-state-in-effect).
  if (!tabSeeded && bookings) {
    setTabSeeded(true);
    if (upcoming.length === 0 && past.length > 0) setTab("past");
  }

  return (
    <div>
      <BookingsHero bookings={list} />

      {list.length === 0 ? (
        <div className="mx-auto max-w-(--container-max-w) px-6 md:px-10 py-16">
          <EmptyState
            icon={<CalendarDays className="w-10 h-10 text-primary/50" strokeWidth={1.5} />}
            title="No booking interests yet"
            description="Browse packages and express your interest to get started."
            action={
              <Button variant="primary" href="/destinations">
                Explore Destinations
              </Button>
            }
            className="mx-auto w-full max-w-md"
          />
        </div>
      ) : (
        <>
          <BookingsToolbar
            tab={tab}
            onTabChange={setTab}
            resultCount={visible.length}
            totalCount={list.length}
          />

          <div className="mx-auto max-w-(--container-max-w) px-6 md:px-10 pt-10 md:pt-14">
            {visible.length === 0 ? (
              <EmptyState
                icon={
                  tab === "upcoming" ? (
                    <PlaneTakeoff className="w-10 h-10 text-primary/50" strokeWidth={1.5} />
                  ) : (
                    <History className="w-10 h-10 text-primary/50" strokeWidth={1.5} />
                  )
                }
                title={
                  tab === "upcoming" ? "Nothing coming up" : "No past trips yet"
                }
                description={
                  tab === "upcoming"
                    ? "Your confirmed and pending trips will appear here."
                    : "Trips you've completed or cancelled will be kept here."
                }
                action={
                  tab === "upcoming" ? (
                    <Button variant="primary" href="/destinations">
                      Explore Destinations
                    </Button>
                  ) : undefined
                }
                className="mx-auto w-full max-w-md"
              />
            ) : (
              <BookingsList
                bookings={visible}
                uploadedDocumentTypes={uploadedDocumentTypes}
                onReviewClick={handleOpenReview}
              />
            )}
          </div>
        </>
      )}

      <CtaBanner
        heading="Questions about your trip?"
        subtext="Our team is a message away — we'll tailor every detail with you before anything is confirmed."
      />

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
