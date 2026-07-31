"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CircleCheck, CircleX } from "lucide-react";
import { emailApi } from "@/lib/endpoints";
import { broadcastEmailVerified } from "@/hooks/useEmailVerifiedSync";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import Button from "@/components/Button/Button";

type Status = "loading" | "success-verify" | "success-change" | "error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const purpose = searchParams.get("purpose");
  const [status, setStatus] = useState<Status>("loading");
  const hasRedeemed = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    // The token is single-use. React Strict Mode (dev) double-invokes effects, and
    // an accidental remount would too — without this guard the second call redeems
    // an already-used token, fails, and flashes the error state over the success.
    if (hasRedeemed.current) return;
    hasRedeemed.current = true;

    const verify =
      purpose === "change-email"
        ? emailApi.verifyChangeEmailToken({ token })
        : emailApi.verifyToken({ token });

    verify
      .then(() => {
        setStatus(purpose === "change-email" ? "success-change" : "success-verify");
        // Tell other open tabs (e.g. a blocked booking gate) to refresh the profile.
        broadcastEmailVerified();
        setTimeout(() => router.replace("/profile"), 3000);
      })
      .catch(() => setStatus("error"));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, purpose]);

  if (status === "loading") {
    return <LoadingSpinner message="Verifying your email…" />;
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <CircleX className="w-14 h-14 text-error" />
        <h1 className="text-headline-sm text-text">Link invalid or expired</h1>
        <p className="text-body-sm text-text-muted max-w-xs">
          This verification link has already been used or has expired. You can request a new one from your profile.
        </p>
        <Button variant="primary" size="md" onClick={() => router.replace("/profile")}>
          Go to profile
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <CircleCheck className="w-14 h-14 text-primary" />
      <h1 className="text-headline-sm text-text">
        {status === "success-change" ? "Email updated!" : "Email verified!"}
      </h1>
      <p className="text-body-sm text-text-muted max-w-xs">
        {status === "success-change"
          ? "Your email address has been updated successfully."
          : "Your email address has been verified successfully."}
        {" "}Redirecting you to your profile…
      </p>
      <Link href="/profile" className="text-body-sm text-primary hover:underline">
        Go now
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <Suspense fallback={<LoadingSpinner message="Loading…" />}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
