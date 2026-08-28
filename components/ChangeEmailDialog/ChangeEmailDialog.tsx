import { useState, useEffect } from "react";
import Dialog from "@/components/Dialog/Dialog";
import FormField from "@/components/FormField/FormField";
import Button from "@/components/Button/Button";
import { isValidEmail } from "@/lib/utils";
import { LIMITS } from "@/lib/validation/limits";

interface ChangeEmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
  /** Page calls the mutation and invokes onSuccess when it completes. */
  onSend: (email: string, onSuccess: () => void) => void;
  isSending: boolean;
  error: Error | null;
}

export default function ChangeEmailDialog({
  isOpen,
  onClose,
  currentEmail,
  onSend,
  isSending,
  error,
}: ChangeEmailDialogProps) {
  const [newEmail, setNewEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sameError, setSameError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Reset local state when the dialog closes (render-time reconciliation on the
  // isOpen transition — avoids a cascading render from an effect).
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);
    if (!isOpen) {
      setNewEmail("");
      setSent(false);
      setSameError("");
      setCooldown(0);
    }
  }

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const handleSend = () => {
    const trimmed = newEmail.trim().toLowerCase();
    if (!trimmed) return;
    if (!isValidEmail(trimmed)) {
      setSameError("Please enter a valid email address.");
      return;
    }
    if (trimmed === currentEmail.toLowerCase()) {
      setSameError("This is already your current email address.");
      return;
    }
    setSameError("");
    onSend(trimmed, () => {
      setSent(true);
      setCooldown(30);
    });
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} ariaLabel="Change email address" size="sm">
      <div className="flex flex-col gap-6">
        <div className="text-center flex flex-col gap-1">
          <h2 className="text-headline-sm text-text">Change email</h2>
          <p className="text-body-sm text-text-muted">
            {sent
              ? `Check your inbox — click the link we sent to ${newEmail} to confirm.`
              : "Enter your new email address and we'll send you a verification link."}
          </p>
        </div>

        {!sent ? (
          <>
            <FormField
              id="new-email"
              label="New email address"
              type="email"
              placeholder="you@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              maxLength={LIMITS.emailMax}
            />
            {(sameError || error) && (
              <p className="text-body-sm text-error">{sameError || error?.message}</p>
            )}
            <Button
              variant="primary"
              size="md"
              onClick={handleSend}
              disabled={!newEmail.trim() || isSending}
              loading={isSending}
              className="w-full"
            >
              Send verification link
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="text"
              onClick={handleSend}
              disabled={isSending || cooldown > 0}
              className="self-center"
            >
              {isSending
                ? "Resending…"
                : cooldown > 0
                  ? `Resend link in ${cooldown}s`
                  : "Resend link"}
            </Button>
            <Button variant="secondary" size="md" onClick={onClose} className="w-full">
              Close
            </Button>
          </>
        )}
      </div>
    </Dialog>
  );
}
