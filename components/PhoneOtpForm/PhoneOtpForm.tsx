"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/Button/Button";
import FormField from "@/components/FormField/FormField";
import OtpInput from "@/components/OtpInput/OtpInput";
import TurnstileWidget, {
  isCaptchaEnabled,
} from "@/components/TurnstileWidget/TurnstileWidget";
import { isValidPhone, toE164Phone } from "@/lib/utils";

/**
 * Must be >= Supabase's per-number window, which defaults to 60s. Shorter and
 * the button re-enables into a guaranteed rejection; the server owns the real
 * window, so this is only the floor for our own button.
 */
const RESEND_COOLDOWN_SECONDS = 60;

interface PhoneOtpFormProps {
  /**
   * Page fires the send and calls onSuccess to advance to the code step.
   * `phone` is already normalised to E.164. `captchaToken` is null when CAPTCHA
   * is not configured for this deployment.
   */
  onSendOtp: (
    phone: string,
    captchaToken: string | null,
    onSuccess: () => void,
  ) => void;
  /** Page fires the verification; onSuccess is for anything after it. */
  onVerifyOtp: (
    phone: string,
    code: string,
    captchaToken: string | null,
    onSuccess: () => void,
  ) => void;
  isSending?: boolean;
  isVerifying?: boolean;
  /** Server-side failure, surfaced by the page (see lib/authErrors.ts). */
  error?: string | null;
  /** Label on the final button — "Sign in", "Verify", etc. */
  submitLabel?: string;
}

/**
 * Two-step phone verification: number, then the 6-digit code. Shared by sign-in
 * and onboarding, which differ only in which Supabase call runs — hence the
 * onSendOtp / onVerifyOtp callbacks rather than the calls living here.
 *
 * Owns its own step, field values, resend cooldown and CAPTCHA token; the page
 * owns the calls.
 */
export default function PhoneOtpForm({
  onSendOtp,
  onVerifyOtp,
  isSending = false,
  isVerifying = false,
  error,
  submitLabel = "Verify",
}: PhoneOtpFormProps) {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [localError, setLocalError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  // Turnstile tokens are single-use, so each attempt needs a fresh one.
  const [captchaNonce, setCaptchaNonce] = useState(0);
  const [captchaUnavailable, setCaptchaUnavailable] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const message = localError || error;
  const awaitingCaptcha = isCaptchaEnabled && !captchaToken;

  // With appearance: "interaction-only" the check is invisible, so a disabled
  // button would otherwise have no visible cause.
  const sendLabel = captchaUnavailable
    ? "Security check unavailable"
    : cooldown > 0
      ? `Try again in ${cooldown}s`
      : awaitingCaptcha
        ? "Checking your browser…"
        : "Send code";

  function consumeCaptcha() {
    setCaptchaToken(null);
    setCaptchaNonce((n) => n + 1);
  }

  function handleSend() {
    // Guard the first send too: "Change number" and re-sending the same number
    // inside the window would otherwise be refused by the server.
    if (cooldown > 0) return;
    if (!isValidPhone(phone)) {
      setLocalError("Please enter a valid 10-digit phone number.");
      return;
    }
    setLocalError("");
    const token = captchaToken;
    consumeCaptcha();
    onSendOtp(toE164Phone(phone), token, () => {
      setStep("code");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    });
  }

  function handleResend() {
    if (cooldown > 0) return;
    setLocalError("");
    // Start the cooldown on the attempt, not on success. A rejected resend is
    // almost always the rate limit itself, so letting the button stay live
    // invites a hammer loop against the very limit that refused it.
    setCooldown(RESEND_COOLDOWN_SECONDS);
    const token = captchaToken;
    consumeCaptcha();
    onSendOtp(toE164Phone(phone), token, () => {});
  }

  function handleVerify() {
    if (code.length < 6) return;
    setLocalError("");
    const token = captchaToken;
    consumeCaptcha();
    onVerifyOtp(toE164Phone(phone), code, token, () => setCode(""));
  }

  const captcha = (
    <>
      <TurnstileWidget
        onToken={setCaptchaToken}
        onUnavailable={() => setCaptchaUnavailable(true)}
        resetKey={captchaNonce}
      />
      {captchaUnavailable && (
        <p className="text-body-sm text-error text-center">
          We couldn&apos;t load the security check. Please disable your ad
          blocker for this site, or try a different browser.
        </p>
      )}
    </>
  );

  if (step === "phone") {
    return (
      <div className="flex w-full flex-col gap-5">
        <FormField
          id="phone"
          label="Phone number"
          type="tel"
          placeholder="9876543210"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setLocalError("");
          }}
          errorMessage={message ?? undefined}
          autoComplete="tel"
          required
        />
        {captcha}
        <Button
          variant="primary"
          onClick={handleSend}
          loading={isSending}
          disabled={!phone.trim() || cooldown > 0 || awaitingCaptcha}
          className="w-full"
        >
          {sendLabel}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-1 text-center">
        <p className="text-body-sm text-text-muted">
          Enter the 6-digit code sent to
        </p>
        <p className="text-body-md font-semibold text-text">
          {toE164Phone(phone)}
        </p>
      </div>

      <OtpInput value={code} onChange={setCode} error={Boolean(message)} />

      {message && <p className="text-body-sm text-error">{message}</p>}

      {captcha}

      <Button
        variant="primary"
        onClick={handleVerify}
        loading={isVerifying}
        disabled={code.length < 6 || awaitingCaptcha}
        className="w-full"
      >
        {submitLabel}
      </Button>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            setStep("phone");
            setCode("");
            setLocalError("");
          }}
          className="inline-flex items-center gap-1.5 text-label-sm text-text-muted transition-colors hover:text-primary cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Change number
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={isSending || cooldown > 0 || awaitingCaptcha}
          className="text-label-sm text-primary transition-opacity hover:underline disabled:opacity-50 cursor-pointer"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
        </button>
      </div>
    </div>
  );
}
