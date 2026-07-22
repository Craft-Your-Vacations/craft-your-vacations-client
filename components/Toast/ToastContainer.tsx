"use client";

import { createPortal } from "react-dom";
import { useToastStore } from "@/stores/useToastStore";
import Toast from "./Toast";

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return createPortal(
    <div
      aria-label="Notifications"
      className="fixed top-20 left-4 right-4 md:left-auto z-70 flex flex-col gap-2 md:w-sm pointer-events-none"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onDismiss={removeToast} />
        </div>
      ))}
    </div>,
    document.body,
  );
}
