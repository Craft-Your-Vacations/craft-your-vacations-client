"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Logo from "@/public/logo.png";
import LogoText from "@/public/logo_text.png";
import Button from "@/components/Button/Button";
import FormField from "@/components/FormField/FormField";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import AuthCard from "@/components/AuthCard/AuthCard";
import { useSendOtp } from "@/hooks/useSendOtp";
import { useVerifyOtp } from "@/hooks/useVerifyOtp";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { useProfile } from "@/hooks/useProfile";
import { useSendEmailVerification } from "@/hooks/useSendEmailVerification";
import { isValidPhone } from "@/lib/utils";

// ─── Progress indicator ────────────────────────────────────────────────────────

const STEPS = ["phone", "otp", "email", "profile"] as const;
const STEP_LABELS = ["Phone", "Verify", "Email", "Profile"];

function ProgressDots({ current }: { current: (typeof STEPS)[number] }) {
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

// ─── Step 1: Phone ─────────────────────────────────────────────────────────────

function PhoneStep() {
  const { phone, setPhone, nextStep } = useOnboardingStore();
  const { mutate: sendOtp, isPending, error } = useSendOtp();
  const [validationError, setValidationError] = useState("");

  const handleSend = () => {
    if (!phone.trim()) return;
    if (!isValidPhone(phone.trim())) {
      setValidationError("Please enter a valid 10-digit phone number.");
      return;
    }
    setValidationError("");
    sendOtp({ mobileNumber: phone.trim() }, { onSuccess: () => nextStep() });
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center flex flex-col gap-1">
        <h2 className="text-headline-sm text-text">Verify your phone</h2>
        <p className="text-body-sm text-text-muted">
          We&apos;ll send a 6-digit code to confirm your number
        </p>
      </div>
      <FormField
        id="phone"
        label="Phone number"
        type="tel"
        placeholder="+91 1234567890"
        value={phone}
        onChange={(e) => { setPhone(e.target.value); setValidationError(""); }}
        required
        autoComplete="tel"
      />
      {(validationError || error) && (
        <p className="text-body-sm text-error">{validationError || error?.message}</p>
      )}
      <Button
        variant="primary"
        size="md"
        onClick={handleSend}
        loading={isPending}
        disabled={!phone.trim()}
      >
        Send OTP
      </Button>
    </div>
  );
}

// ─── Step 2: OTP ───────────────────────────────────────────────────────────────

function OtpStep() {
  const router = useRouter();
  const { phone, nextStep } = useOnboardingStore();
  const { update } = useSession();
  const {
    mutate: verifyOtp,
    isPending: verifying,
    error: verifyError,
  } = useVerifyOtp();
  const {
    mutate: sendOtp,
    isPending: resending,
    error: resendError,
  } = useSendOtp();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    const nextEmpty = pasted.length < 6 ? pasted.length : 5;
    inputRefs.current[nextEmpty]?.focus();
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length < 6) return;
    verifyOtp(
      { mobileNumber: phone, otp: code },
      {
        onSuccess: async () => {
          await update({ phoneVerified: true });
          router.refresh();
          nextStep();
        },
      },
    );
  };

  const handleResend = () => {
    sendOtp({ mobileNumber: phone });
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center flex flex-col gap-1">
        <h2 className="text-headline-sm text-text">Enter the code</h2>
        <p className="text-body-sm text-text-muted">
          Sent to <span className="text-text font-semibold">{phone}</span>
        </p>
      </div>

      {/* 6-box OTP input */}
      <div className="flex justify-center gap-2" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="w-11 h-13 text-center text-headline-sm bg-surface-highest rounded-xl border border-outline focus:ring-2 focus:ring-primary/50 focus:border-primary/40 outline-none text-text transition-all"
          />
        ))}
      </div>

      {(verifyError || resendError) && (
        <p className="text-body-sm text-error text-center">
          {(verifyError ?? resendError)!.message}
        </p>
      )}

      <Button
        variant="primary"
        size="md"
        onClick={handleVerify}
        disabled={otp.join("").length < 6 || verifying}
      >
        {verifying ? "Verifying…" : "Verify"}
      </Button>

      <button
        onClick={handleResend}
        disabled={resending}
        className="text-body-sm text-text-muted hover:text-primary transition-colors cursor-pointer disabled:opacity-50 text-center"
      >
        {resending ? "Resending…" : "Didn't receive it? Resend"}
      </button>
    </div>
  );
}

// ─── Step 3: Email ──────────────────────────────────────────────────────────────

function EmailStep() {
  const { nextStep } = useOnboardingStore();
  const { data: profile, isLoading } = useProfile();
  const { mutate: resend, isPending, error } = useSendEmailVerification();
  const [cooldown, setCooldown] = useState(0);

  // Auto-skip if email is already verified (e.g. Google OAuth users)
  useEffect(() => {
    if (profile && profile.emailVerified) {
      nextStep();
    }
  }, [profile, nextStep]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  if (isLoading || (profile && profile.emailVerified)) {
    return (
      <div className="w-full flex justify-center py-8">
        <p className="text-body-sm text-text-muted">Loading…</p>
      </div>
    );
  }

  const handleResend = () => {
    resend(undefined, { onSuccess: () => setCooldown(30) });
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center flex flex-col gap-1">
        <h2 className="text-headline-sm text-text">Verify your email</h2>
        <p className="text-body-sm text-text-muted">
          We sent a verification link to{" "}
          <span className="text-text font-semibold">{profile?.email}</span>
        </p>
      </div>

      {error && (
        <p className="text-body-sm text-error text-center">{error.message}</p>
      )}

      <button
        onClick={handleResend}
        disabled={isPending || cooldown > 0}
        className="text-body-sm text-primary hover:underline cursor-pointer disabled:opacity-50 text-center"
      >
        {isPending
          ? "Resending…"
          : cooldown > 0
            ? `Resend link in ${cooldown}s`
            : "Resend verification link"}
      </button>

      <button
        onClick={nextStep}
        className="text-body-sm text-text-muted hover:text-primary transition-colors cursor-pointer text-center"
      >
        Skip for now
      </button>
    </div>
  );
}

// ─── Step 4: Profile ───────────────────────────────────────────────────────────

function ProfileStep() {
  const router = useRouter();

  const { reset } = useOnboardingStore();
  const queryClient = useQueryClient();
  const { mutate: updateProfile, isPending, error } = useUpdateProfile();
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nationality, setNationality] = useState("");
  const [countryOfResidence, setCountryOfResidence] = useState("");
  const [profession, setProfession] = useState("");

  const handleComplete = () => {
    updateProfile(
      { dateOfBirth, nationality, countryOfResidence, profession },
      {
        onSuccess: (updatedUser) => {
          queryClient.setQueryData(queryKeys.profile.me(), updatedUser);
          router.replace("/");
          reset();
        },
      },
    );
  };

  const handleSkip = () => {
    router.replace("/");
    reset();
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center flex flex-col gap-1">
        <h2 className="text-headline-sm text-text">Tell us about yourself</h2>
        <p className="text-body-sm text-text-muted">
          A little about you helps us craft journeys made just for you
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <FormField
          id="dob"
          label="Date of birth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
        <FormField
          id="nationality"
          label="Nationality"
          placeholder="e.g. American"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
        />
        <FormField
          id="countryOfResidence"
          label="Country of residence"
          placeholder="e.g. India"
          value={countryOfResidence}
          onChange={(e) => setCountryOfResidence(e.target.value)}
        />
        <FormField
          id="profession"
          label="Profession"
          placeholder="e.g. Software Engineer"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
        />
      </div>

      {error && <p className="text-body-sm text-error">{error.message}</p>}

      <Button
        variant="primary"
        size="md"
        onClick={handleComplete}
        loading={isPending}
      >
        Complete setup
      </Button>

      <button
        onClick={handleSkip}
        className="text-body-sm text-text-muted hover:text-primary transition-colors cursor-pointer text-center"
      >
        Skip for now
      </button>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const { step } = useOnboardingStore();

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
            Step {STEPS.indexOf(step) + 1} of {STEPS.length} —{" "}
            {STEP_LABELS[STEPS.indexOf(step)]}
          </p>
          <ProgressDots current={step} />
        </div>

        {step === "phone" && <PhoneStep />}
        {step === "otp" && <OtpStep />}
        {step === "email" && <EmailStep />}
        {step === "profile" && <ProfileStep />}
      </AuthCard>
    </div>
  );
}
