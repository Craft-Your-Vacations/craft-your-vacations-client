"use client";

import { useEffect, useCallback } from "react";
import { CircleCheck, CircleX, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Toast as ToastData } from "@/stores/useToastStore";

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

export default function Toast({ toast, onDismiss }: ToastProps) {
  const dismiss = useCallback(() => onDismiss(toast.id), [onDismiss, toast.id]);

  useEffect(() => {
    const timer = setTimeout(dismiss, toast.duration);
    return () => clearTimeout(timer);
  }, [dismiss, toast.duration]);

  const isSuccess = toast.type === "success";

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "relative w-full overflow-hidden rounded-xl border shadow-lg animate-toast-enter bg-surface",
        isSuccess
          ? "border-success/50"
          : "border-error/50",
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {isSuccess ? (
          <CircleCheck className="w-5 h-5 text-success shrink-0" />
        ) : (
          <CircleX className="w-5 h-5 text-error shrink-0" />
        )}

        <p
          className={cn(
            "text-body-sm flex-1",
            isSuccess ? "text-success" : "text-error",
          )}
        >
          {toast.message}
        </p>

        <button
          onClick={dismiss}
          className={cn(
            "shrink-0 p-1 rounded-full transition-colors cursor-pointer",
            isSuccess
              ? "hover:bg-success/15 text-success"
              : "hover:bg-error/15 text-error",
          )}
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div
        className={cn(
          "absolute bottom-0 left-0 h-0.5 animate-toast-progress",
          isSuccess ? "bg-success" : "bg-error",
        )}
        style={{ animationDuration: `${toast.duration}ms` }}
      />
    </div>
  );
}
