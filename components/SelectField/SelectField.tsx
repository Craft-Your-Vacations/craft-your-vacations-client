import React from "react";
import type { FieldBaseProps, SelectOption } from "@/app/types/component";
import { ArrowDown, ChevronDown } from "lucide-react";

interface SelectFieldProps extends FieldBaseProps {
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function SelectField({
  id,
  label,
  helperText,
  errorMessage,
  required,
  disabled,
  className = "",
  options,
  placeholder,
  value,
  defaultValue,
  onChange,
}: SelectFieldProps) {
  const hasError = Boolean(errorMessage);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-label-md text-text-muted">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full px-4 py-3 pr-10 rounded-xl text-body-md text-text bg-surface-highest border border-outline outline-none appearance-none cursor-pointer transition-all
           focus:ring-2 focus:ring-primary/50 focus:border-primary/40
           disabled:opacity-50 disabled:cursor-not-allowed
           ${hasError ? "ring-2 ring-error/50 border-error/50" : ""}
         `}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-text-subtle"
          aria-hidden="true"
        >
          
          <ChevronDown/>
        </span>
      </div>
      {hasError && <p className="text-body-sm text-error">{errorMessage}</p>}
      {!hasError && helperText && (
        <p className="text-body-sm text-text-subtle">{helperText}</p>
      )}
    </div>
  );
}

export default SelectField;
