import React from "react";
import type { ButtonVariant, ButtonSize } from "@/app/types/component";
import Link from "next/link";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  "aria-label"?: string;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-body-sm",
  md: "px-6 py-3 text-body-md",
  lg: "px-8 py-4 text-body-lg",
};

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: "w-9 h-9 text-[18px]",
  md: "w-12 h-12 text-[20px]",
  lg: "w-14 h-14 text-[24px]",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  href,
  onClick,
  disabled = false,
  type = "button",
  className = "",
  "aria-label": ariaLabel,
}: ButtonProps) {
  const baseClass =
    "inline-flex items-center justify-center gap-2 font-semibold transition-all cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed";

  let variantClass = "";
  let sizeClass = "";

  switch (variant) {
    case "primary":
      variantClass = "btn-gradient shadow-ambient hover:opacity-90 rounded-2xl";
      sizeClass = sizeClasses[size];
      break;
    case "secondary":
      variantClass =
        "border-2 border-primary/30 hover:border-primary text-primary hover:bg-primary/5 rounded-2xl";
      sizeClass = sizeClasses[size];
      break;
    case "icon":
      variantClass =
        "rounded-full bg-surface-high text-text-muted hover:text-primary";
      sizeClass = iconSizeClasses[size];
      break;
    case "text":
      variantClass =
        "text-primary underline decoration-primary/40 hover:decoration-primary rounded-lg px-1";
      sizeClass = "";
      break;

    case "error":
      variantClass =
        "bg-red-700 text-white shadow-ambient hover:opacity-90 rounded-2xl";
      sizeClass = sizeClasses[size];
      break;
  }

  const allClasses = `${baseClass} ${variantClass} ${sizeClass} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={allClasses}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={allClasses}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

export default Button;
