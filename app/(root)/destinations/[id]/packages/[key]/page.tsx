"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { usePackageDetail } from "@/hooks/usePackageDetail";
import { useDestination } from "@/hooks/useDestination";
import { useCreateBooking } from "@/hooks/useCreateBooking";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorState from "@/components/ErrorState/ErrorState";
import BookingModal from "@/components/BookingModal/BookingModal";
import type { BookingSubmitData } from "@/components/BookingModal/BookingModal";
import CtaBanner from "@/components/CtaBanner/CtaBanner";
import ModalSuccess from "@/components/ModalSuccess/ModalSuccess";
import ModalError from "@/components/ModalError/ModalError";
import PackageHero from "./_sections/PackageHero/PackageHero";
import PackageOverview from "./_sections/PackageOverview/PackageOverview";
import PackageItinerary from "./_sections/PackageItinerary/PackageItinerary";
import OtherPackages from "./_sections/OtherPackages/OtherPackages";

export default function PackageDetailPage({
  params,
}: {
  params: Promise<{ id: string; key: string }>;
}) {
  const { id, key } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingSuccessOpen, setBookingSuccessOpen] = useState(false);
  const [bookingErrorOpen, setBookingErrorOpen] = useState(false);
  const [bookingErrorMsg, setBookingErrorMsg] = useState("");
  const { mutate: createBooking, isPending: bookingPending, error: bookingError, reset: resetBooking } = useCreateBooking();

  function handleBookingSubmit(data: BookingSubmitData) {
    if (!pkg) return;
    createBooking(
      {
        packageId: pkg.id,
        ...data,
      },
      {
        onSuccess: () => {
          setBookingOpen(false);
          setBookingSuccessOpen(true);
        },
        onError: (err) => {
          setBookingOpen(false);
          setBookingErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
          setBookingErrorOpen(true);
        },
      }
    );
  }

  function handleBookingClose() {
    setBookingOpen(false);
  }

  function handleBook() {
    if (session) {
      setBookingOpen(true);
    } else {
      router.replace("/login");
    }
  }

  const {
    data: pkg,
    isLoading: pkgLoading,
    isError: pkgError,
    error: pkgErr,
    refetch: pkgRefetch,
  } = usePackageDetail(id, key);

  const { data: destination } = useDestination(id);

  if (pkgLoading) {
    return <LoadingSpinner message="Loading package..." fullScreen={false} />;
  }

  if (pkgError) {
    return (
      <ErrorState
        message={pkgErr instanceof Error ? pkgErr.message : undefined}
        onRetry={pkgRefetch}
      />
    );
  }

  if (!pkg) {
    return <ErrorState title="Package not found" />;
  }

  const totalActivities = pkg.itinerary.reduce(
    (sum, day) => sum + day.activities.length,
    0
  );

  const otherPackages =
    destination?.packages.filter((p) => p.key !== key) ?? [];

  return (
    <div className="pt-(--section-gap)">
      <PackageHero
        pkg={pkg}
        destination={destination}
        totalActivities={totalActivities}
      />
      <PackageOverview
        pkg={pkg}
        destination={destination}
        totalActivities={totalActivities}
        onBook={handleBook}
      />
      <PackageItinerary pkg={pkg} totalActivities={totalActivities} />
      <OtherPackages
        packages={otherPackages}
        destinationId={id}
        destinationTitle={destination?.title}
      />

      <CtaBanner
        heading={`Ready to Book ${pkg.title}?`}
        subtext="Get in touch and our team will tailor every detail for your perfect trip."
      />

      <BookingModal
        isOpen={bookingOpen}
        onClose={handleBookingClose}
        packageTitle={pkg.title}
        isPending={bookingPending}
        error={bookingError instanceof Error ? bookingError : null}
        onSubmit={handleBookingSubmit}
      />

      <ModalSuccess
        isOpen={bookingSuccessOpen}
        title="Interest Received!"
        message="Our team will reach out soon to help plan your perfect trip."
        onClose={() => setBookingSuccessOpen(false)}
      />

      <ModalError
        isOpen={bookingErrorOpen}
        title="Booking Failed"
        message={bookingErrorMsg}
        onClose={() => { setBookingErrorOpen(false); resetBooking(); }}
      />
    </div>
  );
}
