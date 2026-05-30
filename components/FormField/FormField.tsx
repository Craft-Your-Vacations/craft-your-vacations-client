import React from "react";
import type { FieldBaseProps } from "@/app/types/component";

interface FormFieldProps extends FieldBaseProps {
  type?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  min?: string;
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
  autoComplete,
  min,
}: FormFieldProps) {
  const hasError = Boolean(errorMessage);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-label-md text-text-muted">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
        required={required}
        min={min}
        className={`w-full px-4 py-3 rounded-xl text-body-md text-text placeholder:text-text-subtle bg-surface-highest border border-outline outline-none transition-all
         focus:border-transparent focus:ring-2 focus:ring-primary/50
         disabled:opacity-50 disabled:cursor-not-allowed
         ${hasError ? "ring-2 ring-red-500/50 border-red-500/50" : ""}
       `}
      />
      {hasError && <p className="text-body-sm text-red-400">{errorMessage}</p>}
      {!hasError && helperText && (
        <p className="text-body-sm text-text-subtle">{helperText}</p>
      )}
    </div>
  );
}

export default FormField;
