import Button from "@/components/Button/Button";

interface EmailVerificationBannerProps {
  email: string;
  onResend: () => void;
  isSending: boolean;
  error: Error | null;
  sent: boolean;
}

export default function EmailVerificationBanner({
  email,
  onResend,
  isSending,
  error,
  sent,
}: EmailVerificationBannerProps) {
  if (sent) {
    return (
      <div className="w-full rounded-xl bg-primary/8 border border-primary/20 p-4 flex flex-col gap-2">
        <p className="text-body-sm text-text">
          Check your inbox — we sent a verification link to{" "}
          <span className="font-semibold">{email}</span>.
        </p>
        <button
          onClick={onResend}
          disabled={isSending}
          className="text-label-sm text-primary hover:underline cursor-pointer disabled:opacity-50 self-start"
        >
          {isSending ? "Resending…" : "Resend link"}
        </button>
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
      <Button variant="primary" size="sm" onClick={onResend} disabled={isSending}>
        {isSending ? "Sending…" : "Send verification link"}
      </Button>
    </div>
  );
}
