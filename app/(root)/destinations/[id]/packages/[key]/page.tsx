"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import type { User } from "@/app/types/api";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePackageDetail } from "@/hooks/usePackageDetail";
import { useDestination } from "@/hooks/useDestination";
import { useCreateBooking } from "@/hooks/useCreateBooking";
import { useProfile } from "@/hooks/useProfile";
import { useSendEmailVerification } from "@/hooks/useSendEmailVerification";
import { useSendChangeEmail } from "@/hooks/useSendChangeEmail";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorState from "@/components/ErrorState/ErrorState";
import BookingModal from "@/components/BookingModal/BookingModal";
import type { BookingSubmitData } from "@/components/BookingModal/BookingModal";
import VerifyEmailDialog from "@/components/VerifyEmailDialog/VerifyEmailDialog";
import ChangeEmailDialog from "@/components/ChangeEmailDialog/ChangeEmailDialog";
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
  const queryClient = useQueryClient();
  const status = useAuthStore((s) => s.status);
  const isAuthenticated = status === "authenticated";
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingSuccessOpen, setBookingSuccessOpen] = useState(false);
  const [bookingErrorOpen, setBookingErrorOpen] = useState(false);
  const [bookingErrorMsg, setBookingErrorMsg] = useState("");
  const { mutate: createBooking, isPending: bookingPending, error: bookingError, reset: resetBooking } = useCreateBooking();

  // Verified-email gate for booking
  const { data: profile } = useProfile(isAuthenticated);
  const [verifyEmailOpen, setVerifyEmailOpen] = useState(false);
  const [emailVerifSent, setEmailVerifSent] = useState(false);
  const { mutate: sendEmailVerification, isPending: isSendingVerif, error: sendVerifError } = useSendEmailVerification();
  const [changeEmailOpen, setChangeEmailOpen] = useState(false);
  const { mutate: sendChangeEmail, isPending: isSendingChangeEmail, error: sendChangeEmailError, reset: resetChangeEmail } = useSendChangeEmail();

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
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    // Require a verified email before booking (documents are delivered there).
    if (profile && !profile.emailVerified) {
      setVerifyEmailOpen(true);
      return;
    }
    setBookingOpen(true);
  }

  const handleResendVerification = (onSuccess: () => void) => {
    sendEmailVerification(undefined, {
      onSuccess: () => {
        setEmailVerifSent(true);
        onSuccess();
      },
    });
  };

  const handleSendChangeEmail = (email: string, onSuccess: () => void) => {
    sendChangeEmail({ newEmail: email }, { onSuccess });
  };

  const openChangeEmail = () => {
    setVerifyEmailOpen(false);
    setChangeEmailOpen(true);
  };

  const closeChangeEmail = () => {
    setChangeEmailOpen(false);
    resetChangeEmail();
  };

  // While the verify-email gate is open, re-check verification whenever the user
  // returns to this tab — they likely just clicked the link in another tab. On a
  // fresh "verified", drop the gate and continue straight into booking.
  useEffect(() => {
    if (!verifyEmailOpen) return;
    const recheck = async () => {
      if (document.visibilityState !== "visible") return;
      await queryClient.refetchQueries({ queryKey: queryKeys.profile.me() });
      const fresh = queryClient.getQueryData<User>(queryKeys.profile.me());
      if (fresh?.emailVerified) {
        setVerifyEmailOpen(false);
        setBookingOpen(true);
      }
    };
    document.addEventListener("visibilitychange", recheck);
    window.addEventListener("focus", recheck);
    return () => {
      document.removeEventListener("visibilitychange", recheck);
      window.removeEventListener("focus", recheck);
    };
  }, [verifyEmailOpen, queryClient]);

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

      <VerifyEmailDialog
        isOpen={verifyEmailOpen}
        onClose={() => setVerifyEmailOpen(false)}
        email={profile?.email ?? ""}
        onResend={handleResendVerification}
        isSending={isSendingVerif}
        error={sendVerifError}
        sent={emailVerifSent}
        onEditEmail={openChangeEmail}
      />

      <ChangeEmailDialog
        isOpen={changeEmailOpen}
        onClose={closeChangeEmail}
        currentEmail={profile?.email ?? ""}
        onSend={handleSendChangeEmail}
        isSending={isSendingChangeEmail}
        error={sendChangeEmailError}
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
