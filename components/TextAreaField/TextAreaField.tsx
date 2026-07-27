import { useState } from "react";
import type { FieldBaseProps } from "@/app/types/component";

interface TextAreaFieldProps extends FieldBaseProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  maxLength?: number;
}

export function TextAreaField({
  id,
  label,
  helperText,
  errorMessage,
  required,
  disabled,
  className = "",
  placeholder,
  value,
  defaultValue,
  onChange,
  rows = 4,
  maxLength,
}: TextAreaFieldProps) {
  // Controlled: derive the count straight from `value`. Uncontrolled: track it
  // internally. No effect needed either way.
  const [internalCount, setInternalCount] = useState(
    () => (defaultValue ?? "").length
  );
  const charCount = value !== undefined ? value.length : internalCount;

  const hasError = Boolean(errorMessage);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (value === undefined) setInternalCount(e.target.value.length);
    onChange?.(e);
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {(label || maxLength) && (
        <div className="flex items-baseline justify-between">
          {label ? (
            <label htmlFor={id} className="text-label-md text-text-muted">
              {label}
              {required && <span className="text-primary ml-1">*</span>}
            </label>
          ) : (
            <span />
          )}
          {maxLength && (
            <span className="text-label-sm text-text-subtle">
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={`w-full px-4 py-3 rounded-xl text-body-md text-text placeholder:text-text-subtle bg-surface-highest border border-outline outline-none resize-y transition-all
         focus:ring-2 focus:ring-primary/50 focus:border-primary/40
         disabled:opacity-50 disabled:cursor-not-allowed
         ${hasError ? "ring-2 ring-error/50 border-error/50" : ""}
       `}
      />
      {hasError && <p className="text-body-sm text-error">{errorMessage}</p>}
      {!hasError && helperText && (
        <p className="text-body-sm text-text-subtle">{helperText}</p>
      )}
    </div>
  );
}

export default TextAreaField;
