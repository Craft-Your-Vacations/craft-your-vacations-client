"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/public/logo.png";
import LogoText from "@/public/logo_text.png";
import Button from "@/components/Button/Button";
import FormField from "@/components/FormField/FormField";
import OtpInput from "@/components/OtpInput/OtpInput";
import AuthCard from "@/components/AuthCard/AuthCard";
import { useStartReset } from "@/hooks/useStartReset";
import { useResetPassword } from "@/hooks/useResetPassword";

// ─── Progress dots ──────────────────────────────────────────────────────────

type Step = "identifier" | "reset";
const STEPS: Step[] = ["identifier", "reset"];

function ProgressDots({ current }: { current: Step }) {
  const currentIndex = STEPS.indexOf(current);
  return (
    <div className="flex items-center gap-3">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
              i <= currentIndex ? "bg-primary-app" : "bg-surface-highest"
            }`}
          />
          {i < STEPS.length - 1 && (
            <div
              className={`w-8 h-px transition-colors duration-300 ${
                i < currentIndex ? "bg-primary-app" : "bg-surface-highest"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Step 1: Identifier ─────────────────────────────────────────────────────

function IdentifierStep({
  onSuccess,
}: {
  onSuccess: (identifier: string) => void;
}) {
  const [username, setUsername] = useState("");
  const { mutate: startReset, isPending, error } = useStartReset();

  const handleSend = () => {
    if (!username.trim()) return;
    startReset(
      { identifier: username.trim() },
      { onSuccess: () => onSuccess(username.trim()) },
    );
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center flex flex-col gap-1">
        <h2 className="text-headline-sm text-text">Reset your password</h2>
        <p className="text-body-sm text-text-muted">
          Enter the email or phone number linked to your account
        </p>
      </div>
      <FormField
        id="identifier"
        label="Email or phone number"
        placeholder="you@example.com or +1 234 567 8900"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        autoComplete="email"
      />
      {error && <p className="text-body-sm text-error">{error.message}</p>}
      <Button
        variant="primary"
        size="md"
        onClick={handleSend}
        loading={isPending}
        disabled={!username.trim()}
      >
        Send OTP
      </Button>
    </div>
  );
}

// ─── Step 2: OTP + new password ─────────────────────────────────────────────

function ResetStep({ identifier }: { identifier: string }) {
  const router = useRouter();
  const { mutate: resetPassword, isPending, error } = useResetPassword();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;
  const canSubmit =
    otp.length === 6 &&
    newPassword.length > 0 &&
    newPassword === confirmPassword;

  const handleReset = () => {
    resetPassword(
      { identifier: identifier, otp, newPassword },
      { onSuccess: () => router.replace("/login?reset=success") },
    );
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center flex flex-col gap-1">
        <h2 className="text-headline-sm text-text">Set new password</h2>
        <p className="text-body-sm text-text-muted">
          We&apos;ve sent an OTP to your registered mobile number
        </p>
      </div>

      {/* 6-box OTP input */}
      <OtpInput value={otp} onChange={setOtp} disabled={isPending} />

      <FormField
        id="new-password"
        label="New password"
        type="password"
        placeholder="Min. 8 characters"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        autoComplete="new-password"
      />
      <FormField
        id="confirm-password"
        label="Confirm password"
        type="password"
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        autoComplete="new-password"
        errorMessage={passwordMismatch ? "Passwords do not match" : undefined}
      />

      {error && (
        <p className="text-body-sm text-error text-center">{error.message}</p>
      )}

      <Button
        variant="primary"
        size="md"
        onClick={handleReset}
        loading={isPending}
        disabled={!canSubmit}
      >
        Reset password
      </Button>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function ResetPasswordPage() {
  const [step, setStep] = useState<Step>("identifier");
  const [identifier, setIdentifier] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <AuthCard>
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src={Logo} alt="Logo" className="w-10" />
          <Image src={LogoText} alt="CYV" className="w-28" />
        </div>

        {/* Step label + progress */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-label-md text-text-subtle">
            Step {STEPS.indexOf(step) + 1} of {STEPS.length}
          </p>
          <ProgressDots current={step} />
        </div>

        {step === "identifier" && (
          <IdentifierStep
            onSuccess={(id) => {
              setIdentifier(id);
              setStep("reset");
            }}
          />
        )}
        {step === "reset" && <ResetStep identifier={identifier} />}

        <Link
          href="/login"
          className="text-body-sm text-text-muted hover:text-primary transition-colors text-center"
        >
          Back to sign in
        </Link>
      </AuthCard>
    </div>
  );
}
