import React from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  className = "",
}: CheckboxProps) {
  return (
    <label
      className={cn(
        "flex items-center gap-2 select-none",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        className
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="w-4 h-4 accent-primary rounded"
      />
      <span className="text-body-sm text-text">{label}</span>
    </label>
  );
}

export default Checkbox;
