import type { AuthError } from "@supabase/supabase-js";

/**
 * Supabase auth errors, turned into something a traveller can act on.
 *
 * Two rules here, both learned the hard way:
 *
 * 1. **Branch on `error.code` / `error.status`, never on `error.message`.** The
 *    messages are prose and change between releases; the codes are a published
 *    enum (`ErrorCode` in @supabase/auth-js).
 * 2. **Don't blame the user for a project-level limit.** Supabase caps OTP sends
 *    per *project*, so one person can be refused because of everyone else's
 *    traffic — or an attacker's. "You've made too many requests" is a lie in
 *    that case, and sends them off to check their own behaviour.
 */

/** Supabase's 60s-per-number refusal states the wait in its message. */
const RETRY_AFTER_PATTERN = /after (\d+) seconds?/i;

/**
 * Seconds Supabase says to wait, if it said. Prefer this over any local guess —
 * the server owns the window, and it is configurable per project, so a hardcoded
 * number here would drift the moment someone changes it in the dashboard.
 */
export function retryAfterSeconds(error: AuthError): number | null {
  const match = RETRY_AFTER_PATTERN.exec(error.message);
  if (!match) return null;
  const seconds = Number(match[1]);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : null;
}

/** Message for a failed OTP *send* (`signInWithOtp` / `updateUser({ phone })`). */
export function otpSendErrorMessage(error: AuthError): string {
  const wait = retryAfterSeconds(error);
  if (wait) {
    return `Please wait ${wait} second${wait === 1 ? "" : "s"} before requesting another code.`;
  }

  switch (error.code) {
    // Project-wide hourly ceiling. Not this person's fault, so don't imply it is.
    case "over_sms_send_rate_limit":
      return "We're sending a lot of codes right now. Please try again in a few minutes.";
    case "over_request_rate_limit":
      return "Too many attempts. Please wait a moment and try again.";
    case "sms_send_failed":
      return "We couldn't deliver the code. Please check the number and try again.";
    case "otp_disabled":
      return "Phone sign-in is temporarily unavailable. Please use Google instead.";
    case "captcha_failed":
      return "We couldn't verify you're human. Please try again.";
    case "validation_failed":
      return "That phone number doesn't look right. Please check and try again.";
  }

  // A 429 with no code we recognise is still a rate limit.
  if (error.status === 429) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  return "We couldn't send the code. Please try again.";
}

/** Message for a failed OTP *verification* (`verifyOtp`). */
export function otpVerifyErrorMessage(error: AuthError): string {
  switch (error.code) {
    case "otp_expired":
      return "That code has expired. Request a new one.";
    case "over_request_rate_limit":
      return "Too many attempts. Please wait a moment and try again.";
    case "captcha_failed":
      return "We couldn't verify you're human. Please try again.";
  }

  if (error.status === 429) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  // The common case: wrong digits. Deliberately vague about whether the code was
  // wrong or stale — distinguishing them tells an attacker which numbers exist.
  return "That code is incorrect or has expired.";
}
