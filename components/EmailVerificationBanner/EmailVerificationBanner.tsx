import { useState, useEffect } from "react";
import Button from "@/components/Button/Button";

interface EmailVerificationBannerProps {
  /**
   * The address awaiting verification, or "" when the account has none yet —
   * a phone sign-up starts with no email, since it is optional at signup and
   * only required at booking. That case gets "add" copy, not "verify" copy:
   * there is nothing to send a link to, and asking to resend one would report
   * a success that never happened.
   */
  email: string;
  onResend: (onSuccess: () => void) => void;
  isSending: boolean;
  error: Error | null;
  sent: boolean;
  /** Opens the add/change dialog. Required in practice when `email` is "". */
  onEditEmail?: () => void;
}

export default function EmailVerificationBanner({
  email,
  onResend,
  isSending,
  error,
  sent,
  onEditEmail,
}: EmailVerificationBannerProps) {
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const handleResend = () => {
    onResend(() => setCooldown(30));
  };

  // No address on the account yet — the only sensible action is to add one.
  if (!email) {
    return (
      <div className="w-full rounded-xl bg-warning/10 border border-warning/20 p-4 flex flex-col gap-3">
        <p className="text-body-sm text-text">
          <span className="font-semibold">Add your email</span> — we&apos;ll need
          it to confirm your booking and send your travel documents.
        </p>
        {onEditEmail && (
          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" onClick={onEditEmail}>
              Add email
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (sent) {
    return (
      <div className="w-full rounded-xl bg-primary/8 border border-primary/20 p-4 flex flex-col gap-2">
        <p className="text-body-sm text-text">
          Check your inbox — we sent a verification link to{" "}
          <span className="font-semibold">{email}</span>.
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={handleResend}
            disabled={isSending || cooldown > 0}
            className="text-label-sm text-primary hover:underline cursor-pointer disabled:opacity-50"
          >
            {isSending
              ? "Resending…"
              : cooldown > 0
                ? `Resend link in ${cooldown}s`
                : "Resend link"}
          </button>
          {onEditEmail && (
            <button
              onClick={onEditEmail}
              className="text-label-sm text-text-muted hover:text-primary transition-colors cursor-pointer"
            >
              Not your email? Change it
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl bg-warning/10 border border-warning/20 p-4 flex flex-col gap-3">
      <p className="text-body-sm text-text">
        <span className="font-semibold">Verify your email</span> — confirm{" "}
        <span className="font-semibold">{email}</span> to secure your account.
      </p>
      {error && <p className="text-body-sm text-error">{error.message}</p>}
      <div className="flex items-center gap-3">
        <Button variant="primary" size="sm" onClick={handleResend} disabled={isSending}>
          {isSending ? "Sending…" : "Send verification link"}
        </Button>
        {onEditEmail && (
          <button
            onClick={onEditEmail}
            className="text-label-sm text-text-muted hover:text-primary transition-colors cursor-pointer"
          >
            Wrong email? Change it
          </button>
        )}
      </div>
    </div>
  );
}
