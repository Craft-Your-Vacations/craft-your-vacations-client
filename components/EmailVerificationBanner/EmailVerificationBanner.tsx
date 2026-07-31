import { useState, useEffect } from "react";
import Button from "@/components/Button/Button";

interface EmailVerificationBannerProps {
  email: string;
  onResend: (onSuccess: () => void) => void;
  isSending: boolean;
  error: Error | null;
  sent: boolean;
  /** Optional — when provided, shows a "Wrong email? Change it" affordance. */
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
