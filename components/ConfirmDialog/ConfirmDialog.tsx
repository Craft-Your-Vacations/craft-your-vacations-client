"use client";

import { AlertTriangle } from "lucide-react";
import Button from "@/components/Button/Button";
import Dialog from "@/components/Dialog/Dialog";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning";
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onCancel} ariaLabel={title} className="items-center gap-5 text-center">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          variant === "danger" ? "bg-error/15" : "bg-primary/15"
        }`}
      >
        <AlertTriangle
          className={`w-6 h-6 ${variant === "danger" ? "text-error" : "text-primary"}`}
          strokeWidth={1.5}
        />
      </div>

      <div>
        <h2 className="text-headline-md text-text">{title}</h2>
        <p className="text-body-md text-text-muted mt-2">{message}</p>
      </div>

      <div className="flex gap-3 w-full">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={isPending}
          className="flex-1"
        >
          {cancelLabel}
        </Button>
        <Button
          variant={variant === "danger" ? "error" : "primary"}
          onClick={onConfirm}
          loading={isPending}
          className="flex-1"
        >
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
