import React from "react";
import type { FieldBaseProps } from "@/app/types/component";

interface FormFieldProps extends FieldBaseProps {
  type?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  min?: string | number;
  max?: string | number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** Optional leading icon (e.g. a search glyph). */
  icon?: React.ReactNode;
}

export function FormField({
  id,
  label,
  helperText,
  errorMessage,
  required,
  disabled,
  className = "",
  type = "text",
  placeholder,
  value,
  defaultValue,
  onChange,
  onKeyDown,
  autoComplete,
  min,
  max,
  maxLength,
  minLength,
  pattern,
  inputMode,
  onBlur,
  icon,
}: FormFieldProps) {
  const hasError = Boolean(errorMessage);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-label-md text-text-muted">
          {label}
          {required && <span className="text-primary ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-text-muted">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          aria-label={label ? undefined : placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          disabled={disabled}
          autoComplete={autoComplete}
          required={required}
          min={min}
          max={max}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          inputMode={inputMode}
          className={`w-full ${icon ? "pl-10 pr-4" : "px-4"} py-3 rounded-xl text-body-md text-text placeholder:text-text-subtle bg-surface-highest border border-outline outline-none transition-all
           focus:border-transparent focus:ring-2 focus:ring-primary/50
           disabled:opacity-50 disabled:cursor-not-allowed
           ${hasError ? "ring-2 ring-error/50 border-error/50" : ""}
         `}
        />
      </div>
      {hasError && <p className="text-body-sm text-error">{errorMessage}</p>}
      {!hasError && helperText && (
        <p className="text-body-sm text-text-subtle">{helperText}</p>
      )}
    </div>
  );
}

export default FormField;
