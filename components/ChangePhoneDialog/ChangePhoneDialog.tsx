import { useState, useRef, useEffect } from "react";
import Dialog from "@/components/Dialog/Dialog";
import FormField from "@/components/FormField/FormField";
import Button from "@/components/Button/Button";
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
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [sameError, setSameError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setNewPhone("");
      setOtpSent(false);
      setOtp(["", "", "", "", "", ""]);
      setSameError("");
    }
  }, [isOpen]);

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
    const code = otp.join("");
    if (code.length < 6) return;
    onVerifyOtp(newPhone.trim(), code, () => onClose());
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...otp];
    pasted.split("").forEach((char, i) => { next[i] = char; });
    setOtp(next);
    const nextEmpty = pasted.length < 6 ? pasted.length : 5;
    inputRefs.current[nextEmpty]?.focus();
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
              className="w-full"
            >
              {isSendingOtp ? "Sending…" : "Send OTP"}
            </Button>
          </>
        ) : (
          <>
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="w-11 h-13 text-center text-headline-sm bg-surface-highest rounded-xl border border-outline focus:ring-2 focus:ring-primary/50 focus:border-primary/40 outline-none text-text transition-all"
                />
              ))}
            </div>
            {verifyError && (
              <p className="text-body-sm text-error text-center">{verifyError.message}</p>
            )}
            <Button
              variant="primary"
              size="md"
              onClick={handleVerify}
              disabled={otp.join("").length < 6 || isVerifying}
              className="w-full"
            >
              {isVerifying ? "Verifying…" : "Verify"}
            </Button>
            <button
              onClick={handleSendOtp}
              disabled={isSendingOtp}
              className="text-body-sm text-text-muted hover:text-primary transition-colors cursor-pointer disabled:opacity-50 text-center"
            >
              {isSendingOtp ? "Resending…" : "Resend code"}
            </button>
          </>
        )}
      </div>
    </Dialog>
  );
}
