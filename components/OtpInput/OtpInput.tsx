"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
  className?: string;
}

// Segmented numeric OTP entry. Parent owns the code as a single string;
// this component manages per-box focus, backspace navigation and paste.
export function OtpInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  className = "",
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const emit = (next: string[]) => onChange(next.join("").slice(0, length));

  const handleChange = (raw: string, index: number) => {
    if (!/^\d*$/.test(raw)) return;
    const next = [...digits];
    next[index] = raw.slice(-1);
    emit(next);
    if (raw && index < length - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;
    const next = Array.from({ length }, (_, i) => pasted[i] ?? "");
    emit(next);
    const nextEmpty = pasted.length < length ? pasted.length : length - 1;
    inputRefs.current[nextEmpty]?.focus();
  };

  return (
    <div className={cn("flex justify-center gap-2", className)} onPaste={handlePaste}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-12 h-12 text-center text-headline-sm bg-surface-highest rounded-xl border border-outline focus:ring-2 focus:ring-primary/50 focus:border-primary/40 outline-none text-text transition-all disabled:opacity-50"
        />
      ))}
    </div>
  );
}

export default OtpInput;
