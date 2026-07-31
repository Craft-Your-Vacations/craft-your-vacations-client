import Dialog from "@/components/Dialog/Dialog";
import EmailVerificationBanner from "@/components/EmailVerificationBanner/EmailVerificationBanner";

interface VerifyEmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onResend: (onSuccess: () => void) => void;
  isSending: boolean;
  error: Error | null;
  sent: boolean;
  /** Close this dialog and open the change-email flow (owned by the page). */
  onEditEmail: () => void;
}

// Shown when a user tries a verified-email-gated action (e.g. booking) without a
// verified email. Reuses EmailVerificationBanner for the send/resend + edit affordance.
export default function VerifyEmailDialog({
  isOpen,
  onClose,
  email,
  onResend,
  isSending,
  error,
  sent,
  onEditEmail,
}: VerifyEmailDialogProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} ariaLabel="Verify your email" size="sm">
      <div className="flex flex-col gap-5">
        <div className="text-center flex flex-col gap-1">
          <h2 className="text-headline-sm text-text">Verify your email to book</h2>
          <p className="text-body-sm text-text-muted">
            We&apos;ll send your booking confirmation and trip documents here, so
            we need a verified email before you book.
          </p>
        </div>

        <EmailVerificationBanner
          email={email}
          onResend={onResend}
          isSending={isSending}
          error={error}
          sent={sent}
          onEditEmail={onEditEmail}
        />
      </div>
    </Dialog>
  );
}
