import { useState } from "react";
import Dialog from "@/components/Dialog/Dialog";
import FormField from "@/components/FormField/FormField";
import Button from "@/components/Button/Button";
import OtpInput from "@/components/OtpInput/OtpInput";
import { isValidPhone } from "@/lib/utils";

interface ChangePhoneDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhone: string;
  onSendOtp: (phone: string, onSuccess: () => void) => void;
  onVerifyOtp: (phone: string, otp: string, onSuccess: () => void) => void;
  isSendingOtp: boolean;
  isVerifying: boolean;
  sendOtpError: Error | null;
  verifyError: Error | null;
}

export default function ChangePhoneDialog({
  isOpen,
  onClose,
  currentPhone,
  onSendOtp,
  onVerifyOtp,
  isSendingOtp,
  isVerifying,
  sendOtpError,
  verifyError,
}: ChangePhoneDialogProps) {
  const [newPhone, setNewPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [sameError, setSameError] = useState("");

  // Reset local state when the dialog closes (render-time reconciliation on the
  // isOpen transition — avoids a cascading render from an effect).
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);
    if (!isOpen) {
      setNewPhone("");
      setOtpSent(false);
      setOtp("");
      setSameError("");
    }
  }

  const handleSendOtp = () => {
    const trimmed = newPhone.trim();
    if (!trimmed) return;
    if (!isValidPhone(trimmed)) {
      setSameError("Please enter a valid 10-digit phone number.");
      return;
    }
    const normalized = trimmed.startsWith("+91") ? trimmed : "+91" + trimmed;
    if (normalized === currentPhone) {
      setSameError("This is already your current phone number.");
      return;
    }
    setSameError("");
    onSendOtp(trimmed, () => setOtpSent(true));
  };

  const handleVerify = () => {
    if (otp.length < 6) return;
    onVerifyOtp(newPhone.trim(), otp, () => onClose());
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} ariaLabel="Change phone number" size="sm">
      <div className="flex flex-col gap-6">
        <div className="text-center flex flex-col gap-1">
          <h2 className="text-headline-sm text-text">Change phone number</h2>
          <p className="text-body-sm text-text-muted">
            {otpSent
              ? `Enter the 6-digit code sent to ${newPhone}`
              : "Enter your new number and we'll send a verification code."}
          </p>
        </div>

        {!otpSent ? (
          <>
            <FormField
              id="new-phone"
              label="New phone number"
              type="tel"
              placeholder="+91 1234567890"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              required
            />
            {(sameError || sendOtpError) && (
              <p className="text-body-sm text-error">{sameError || sendOtpError?.message}</p>
            )}
            <Button
              variant="primary"
              size="md"
              onClick={handleSendOtp}
              disabled={!newPhone.trim() || isSendingOtp}
              loading={isSendingOtp}
              className="w-full"
            >
              Send OTP
            </Button>
          </>
        ) : (
          <>
            <OtpInput value={otp} onChange={setOtp} disabled={isVerifying} />
            {verifyError && (
              <p className="text-body-sm text-error text-center">{verifyError.message}</p>
            )}
            <Button
              variant="primary"
              size="md"
              onClick={handleVerify}
              disabled={otp.length < 6 || isVerifying}
              loading={isVerifying}
              className="w-full"
            >
              Verify
            </Button>
            <Button
              variant="text"
              onClick={handleSendOtp}
              disabled={isSendingOtp}
              className="self-center"
            >
              {isSendingOtp ? "Resending…" : "Resend code"}
            </Button>
          </>
        )}
      </div>
    </Dialog>
  );
}
