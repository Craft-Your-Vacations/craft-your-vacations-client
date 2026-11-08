"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { decodeClaims } from "@/lib/supabase/claims";
import { selectNeedsOnboarding, useAuthStore } from "@/stores/useAuthStore";
import Logo from "@/public/logo.png";
import LogoText from "@/public/logo_text.png";
import Button from "@/components/Button/Button";
import FormField from "@/components/FormField/FormField";
import AuthCard from "@/components/AuthCard/AuthCard";
import ProgressDots from "@/components/ProgressDots/ProgressDots";
import PhoneOtpForm from "@/components/PhoneOtpForm/PhoneOtpForm";
import ChangeEmailDialog from "@/components/ChangeEmailDialog/ChangeEmailDialog";
import { queryKeys } from "@/lib/queryKeys";
import { useProfile } from "@/hooks/useProfile";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { useSendChangeEmail } from "@/hooks/useSendChangeEmail";
import { useSendEmailVerification } from "@/hooks/useSendEmailVerification";
import { onboardingDetailsSchema, profileSchema } from "@/lib/validation/schemas";
import { getFieldErrors } from "@/lib/validation/getFieldErrors";
import { otpSendErrorMessage, otpVerifyErrorMessage } from "@/lib/authErrors";
import { LIMITS } from "@/lib/validation/limits";
import type { User } from "@/app/types/api";

type Step = "phone" | "details" | "email" | "profile";

const STEP_LABELS: Record<Step, string> = {
  phone: "Phone",
  details: "Your details",
  email: "Email",
  profile: "Profile",
};

/**
 * Onboarding fills whatever the sign-in method left behind, so the route through
 * it depends on how the account was created:
 *
 *   Google         → name + verified email, no phone      → phone, profile
 *   Phone OTP      → verified phone, no name, no email    → details, profile
 *   Email/password → name + unverified email, no phone    → phone, email, profile
 *
 * The `profile` tail only appears when something above it was actually needed —
 * it is optional extra detail, not a reason to send a complete user back here.
 * An empty list therefore means "nothing to do".
 */
function stepsFor(profile: User): Step[] {
  const steps: Step[] = [];
  if (!profile.mobileNumber) steps.push("phone");
  if (!profile.name?.trim()) steps.push("details");
  else if (profile.email && !profile.emailVerified) steps.push("email");
  if (steps.length > 0) steps.push("profile");
  return steps;
}

// ─── Step: Phone ───────────────────────────────────────────────────────────────

/**
 * Adds a phone to an account that already exists (Google / email-password).
 * Supabase treats this as a phone *change* rather than a sign-in, so it is
 * updateUser + verifyOtp({ type: "phone_change" }) — not signInWithOtp.
 */
function PhoneStep({ onDone }: { onDone: () => void }) {
  const queryClient = useQueryClient();
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The token is deliberately unused: updateUser's only option is
  // `emailRedirectTo` (see UserAttributes in @supabase/auth-js), so there is no
  // way to forward one. That is consistent with it being an authenticated call —
  // GoTrue gates CAPTCHA on the anonymous entry points, not on PUT /user. The
  // parameter stays so PhoneOtpForm keeps one signature for both callers.
  const handleSend = async (
    phone: string,
    _captchaToken: string | null,
    onSuccess: () => void,
  ) => {
    setError(null);
    setSending(true);

    const supabase = getSupabaseBrowserClient();
    const { error: sendError } = await supabase.auth.updateUser({ phone });

    setSending(false);

    if (sendError) {
      setError(otpSendErrorMessage(sendError));
      return;
    }

    onSuccess();
  };

  const handleVerify = async (
    phone: string,
    code: string,
    captchaToken: string | null,
    onSuccess: () => void,
  ) => {
    setError(null);
    setVerifying(true);

    const supabase = getSupabaseBrowserClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: "phone_change",
      options: captchaToken ? { captchaToken } : undefined,
    });

    if (verifyError) {
      setVerifying(false);
      setError(otpVerifyErrorMessage(verifyError));
      return;
    }

    // The on_auth_user_phone_changed trigger has now written mobile_number, so
    // re-mint the token to flip the phone_verified claim — otherwise the guards
    // keep sending the user back here for up to 15 minutes.
    await supabase.auth.refreshSession();
    await queryClient.invalidateQueries({ queryKey: queryKeys.profile.me() });

    setVerifying(false);
    onSuccess();
    onDone();
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center flex flex-col gap-1">
        <h2 className="text-headline-sm text-text">Verify your phone</h2>
        <p className="text-body-sm text-text-muted">
          We&apos;ll send a 6-digit code to confirm your number
        </p>
      </div>
      <PhoneOtpForm
        onSendOtp={handleSend}
        onVerifyOtp={handleVerify}
        isSending={sending}
        isVerifying={verifying}
        error={error}
        submitLabel="Verify"
      />
    </div>
  );
}

// ─── Step: Details (name + optional email) ─────────────────────────────────────

/**
 * The gap a phone sign-up leaves: Supabase creates the account from the number
 * alone, so there is no name and no email. Name is required here; email is
 * optional and only becomes mandatory at booking.
 */
function DetailsStep({ onDone }: { onDone: () => void }) {
  const queryClient = useQueryClient();
  const {
    mutate: updateProfile,
    isPending: savingName,
    error: saveError,
  } = useUpdateProfile();
  const {
    mutate: sendChangeEmail,
    isPending: sendingEmail,
    error: emailError,
  } = useSendChangeEmail();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [linkSentTo, setLinkSentTo] = useState<string | null>(null);

  const handleSave = () => {
    const fieldErrors = getFieldErrors(onboardingDetailsSchema, { name, email });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    updateProfile(
      { name: trimmedName },
      {
        onSuccess: async (updatedUser) => {
          queryClient.setQueryData(queryKeys.profile.me(), updatedUser);
          // Re-mint the token so the has_name claim flips to true, or the guards
          // bounce the user straight back into onboarding.
          await getSupabaseBrowserClient().auth.refreshSession();

          if (!trimmedEmail) {
            onDone();
            return;
          }

          // Adding an email goes through the same confirm-by-link flow as
          // changing one: the address only lands on the account once the link
          // in the inbox is clicked, so it cannot be used to claim someone
          // else's address.
          sendChangeEmail(
            { newEmail: trimmedEmail },
            { onSuccess: () => setLinkSentTo(trimmedEmail) },
          );
        },
      },
    );
  };

  if (linkSentTo) {
    return (
      <div className="w-full flex flex-col gap-6">
        <div className="text-center flex flex-col gap-1">
          <h2 className="text-headline-sm text-text">Check your inbox</h2>
          <p className="text-body-sm text-text-muted">
            We sent a confirmation link to{" "}
            <span className="text-text font-semibold">{linkSentTo}</span>. Open it
            to finish adding your email — you can carry on in the meantime.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={onDone}>
          Continue
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center flex flex-col gap-1">
        <h2 className="text-headline-sm text-text">What should we call you?</h2>
        <p className="text-body-sm text-text-muted">
          Your email is optional for now — we&apos;ll ask for it when you book
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <FormField
          id="onboarding-name"
          label="Full name"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors({});
          }}
          required
          autoComplete="name"
          maxLength={LIMITS.fullNameMax}
          errorMessage={errors.name}
        />
        <FormField
          id="onboarding-email"
          label="Email (optional)"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors({});
          }}
          autoComplete="email"
          maxLength={LIMITS.emailMax}
          errorMessage={errors.email}
        />
      </div>

      {(saveError || emailError) && (
        <p className="text-body-sm text-error">
          {(saveError ?? emailError)!.message}
        </p>
      )}

      <Button
        variant="primary"
        size="md"
        onClick={handleSave}
        loading={savingName || sendingEmail}
        disabled={!name.trim()}
      >
        Continue
      </Button>
    </div>
  );
}

// ─── Step: Email verification ──────────────────────────────────────────────────

function EmailStep({ onDone }: { onDone: () => void }) {
  const { data: profile } = useProfile();
  const { mutate: resend, isPending, error } = useSendEmailVerification();
  const [cooldown, setCooldown] = useState(0);
  const [changeEmailOpen, setChangeEmailOpen] = useState(false);
  const {
    mutate: sendChangeEmail,
    isPending: isSendingChangeEmail,
    error: changeEmailError,
    reset: resetChangeEmail,
  } = useSendChangeEmail();

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const handleResend = () => {
    resend(undefined, { onSuccess: () => setCooldown(30) });
  };

  const handleSendChangeEmail = (newEmail: string, onSuccess: () => void) => {
    sendChangeEmail({ newEmail }, { onSuccess });
  };

  const closeChangeEmail = () => {
    setChangeEmailOpen(false);
    resetChangeEmail();
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center flex flex-col gap-1">
        <h2 className="text-headline-sm text-text">Verify your email</h2>
        <p className="text-body-sm text-text-muted">
          We sent a verification link to{" "}
          <span className="text-text font-semibold">{profile?.email}</span>
        </p>
        <button
          onClick={() => setChangeEmailOpen(true)}
          className="text-label-sm text-primary hover:underline cursor-pointer"
        >
          Not your email? Change it
        </button>
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
        onClick={onDone}
        className="text-body-sm text-text-muted hover:text-primary transition-colors cursor-pointer text-center"
      >
        Skip for now
      </button>

      <ChangeEmailDialog
        isOpen={changeEmailOpen}
        onClose={closeChangeEmail}
        currentEmail={profile?.email ?? ""}
        onSend={handleSendChangeEmail}
        isSending={isSendingChangeEmail}
        error={changeEmailError}
      />
    </div>
  );
}

// ─── Step: Profile ─────────────────────────────────────────────────────────────

function ProfileStep({ onDone }: { onDone: () => void }) {
  const queryClient = useQueryClient();
  const { mutate: updateProfile, isPending, error } = useUpdateProfile();
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nationality, setNationality] = useState("");
  const [countryOfResidence, setCountryOfResidence] = useState("");
  const [profession, setProfession] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleComplete = () => {
    const fieldErrors = getFieldErrors(profileSchema, {
      dateOfBirth,
      nationality,
      countryOfResidence,
      profession,
    });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    updateProfile(
      { dateOfBirth, nationality, countryOfResidence, profession },
      {
        onSuccess: (updatedUser) => {
          queryClient.setQueryData(queryKeys.profile.me(), updatedUser);
          onDone();
        },
      },
    );
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
          errorMessage={errors.dateOfBirth}
        />
        <FormField
          id="nationality"
          label="Nationality"
          placeholder="e.g. American"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          maxLength={LIMITS.nationalityMax}
          errorMessage={errors.nationality}
        />
        <FormField
          id="countryOfResidence"
          label="Country of residence"
          placeholder="e.g. India"
          value={countryOfResidence}
          onChange={(e) => setCountryOfResidence(e.target.value)}
          maxLength={LIMITS.nationalityMax}
          errorMessage={errors.countryOfResidence}
        />
        <FormField
          id="profession"
          label="Profession"
          placeholder="e.g. Software Engineer"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          maxLength={LIMITS.professionMax}
          errorMessage={errors.profession}
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
        onClick={onDone}
        className="text-body-sm text-text-muted hover:text-primary transition-colors cursor-pointer text-center"
      >
        Skip for now
      </button>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const { data: profile, isLoading } = useProfile();
  const needsOnboarding = useAuthStore(selectNeedsOnboarding);
  const [steps, setSteps] = useState<Step[] | null>(null);
  const [index, setIndex] = useState(0);
  const [claimsStuck, setClaimsStuck] = useState(false);
  const refreshAttempted = useRef(false);

  // Decide the route through onboarding once, from the first profile read.
  // Re-deriving it on every render would reshuffle the steps underneath the user
  // as each one completes. Seeded during render (not an effect) per AGENTS.md.
  if (profile && steps === null) setSteps(stepsFor(profile));

  const done = steps !== null && index >= steps.length;

  /**
   * Leaving onboarding is the one place where the two sources of truth have to
   * agree: the step list comes from the profile API, while the guard that sends
   * people here reads the JWT claims. If this page redirected to "/" whenever it
   * ran out of steps, a profile the claims don't reflect would bounce between
   * here and `RootGuard` forever.
   *
   * So: leave only once the claims agree. If they don't, re-mint the token once
   * — the usual cause is simply that it predates the last change. If a fresh
   * token still disagrees, the access-token hook isn't emitting the claims (it
   * needs `supabase_auth_glue.sql` re-run), and we say so instead of spinning.
   */
  useEffect(() => {
    if (!done) return;

    if (!needsOnboarding) {
      router.replace("/");
      return;
    }

    if (refreshAttempted.current) return;
    refreshAttempted.current = true;

    let cancelled = false;
    void getSupabaseBrowserClient()
      .auth.refreshSession()
      .then(({ data }) => {
        if (cancelled) return;
        // Read the refreshed token directly rather than waiting on the store:
        // if the claims come back unchanged the store emits no new value, so
        // this component would never re-render to notice.
        const claims = decodeClaims(data.session?.access_token);
        if (claims.phone_verified && claims.has_name) {
          router.replace("/");
          return;
        }
        console.error(
          "Onboarding is complete but the access token disagrees — the custom " +
            "access-token hook is not emitting the expected claims. Re-run " +
            "supabase_auth_glue.sql and check Authentication -> Hooks.",
          claims,
        );
        setClaimsStuck(true);
      });

    return () => {
      cancelled = true;
    };
  }, [done, needsOnboarding, router]);

  if (claimsStuck) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <AuthCard>
          <div className="flex items-center gap-2">
            <Image src={Logo} alt="Logo" className="w-10" />
            <Image src={LogoText} alt="CYV" className="w-28" />
          </div>
          <div className="text-center flex flex-col gap-2">
            <h2 className="text-headline-sm text-text">
              We couldn&apos;t finish setting you up
            </h2>
            <p className="text-body-sm text-text-muted">
              Your details are saved, but we can&apos;t confirm them on this
              device. Try again, or sign out and sign back in.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => window.location.reload()}
          >
            Try again
          </Button>
          <Button
            variant="text"
            onClick={() => {
              void getSupabaseBrowserClient()
                .auth.signOut()
                .then(() => window.location.replace("/login"));
            }}
          >
            Sign out
          </Button>
        </AuthCard>
      </div>
    );
  }

  if (isLoading || steps === null || done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-body-sm text-text-muted">Loading…</p>
      </div>
    );
  }

  const step = steps[index];
  const goNext = () => setIndex((i) => i + 1);

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
            Step {index + 1} of {steps.length} — {STEP_LABELS[step]}
          </p>
          <ProgressDots steps={steps} current={step} />
        </div>

        {step === "phone" && <PhoneStep onDone={goNext} />}
        {step === "details" && <DetailsStep onDone={goNext} />}
        {step === "email" && <EmailStep onDone={goNext} />}
        {step === "profile" && <ProfileStep onDone={goNext} />}
      </AuthCard>
    </div>
  );
}
