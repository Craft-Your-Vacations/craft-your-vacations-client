"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface DialogProps {
  isOpen: boolean;
  /** When provided: backdrop click and Escape key will call this to close */
  onClose?: () => void;
  ariaLabel: string;
  /** Controls the max-width of the panel. Defaults to "sm" (max-w-sm) */
  size?: "sm" | "lg";
  /** Extra classes applied to the panel (e.g. alignment, gap) */
  className?: string;
  children: React.ReactNode;
}

export default function Dialog({
  isOpen,
  onClose,
  ariaLabel,
  size = "sm",
  className,
  children,
}: DialogProps) {
  useEffect(() => {
    if (!isOpen || !onClose) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose!();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-overlay/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "relative z-10 w-full modal-panel shadow-lg shadow-primary/20 rounded-3xl p-8 flex flex-col",
          size === "lg" ? "max-w-lg" : "max-w-sm",
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
