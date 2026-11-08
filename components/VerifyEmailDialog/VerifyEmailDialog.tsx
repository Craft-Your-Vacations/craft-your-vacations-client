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
// verified email. Reuses EmailVerificationBanner for the send/resend + edit
// affordance, including its no-email state — a phone sign-up reaches this dialog
// with nothing on the account, so the copy has to ask for an address rather than
// for confirmation of one.
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
  const isAdding = !email;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={isAdding ? "Add your email" : "Verify your email"}
      size="sm"
    >
      <div className="flex flex-col gap-5">
        <div className="text-center flex flex-col gap-1">
          <h2 className="text-headline-sm text-text">
            {isAdding ? "Add your email to book" : "Verify your email to book"}
          </h2>
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
