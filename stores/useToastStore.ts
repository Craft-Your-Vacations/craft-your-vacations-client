import { create } from "zustand";

export type ToastType = "success" | "error";

export interface Toast {
  id: string;
  key?: string;
  type: ToastType;
  message: string;
  duration: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: { key?: string; type: ToastType; message: string; duration?: number }) => void;
  removeToast: (id: string) => void;
}

const MAX_TOASTS = 3;
let counter = 0;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: ({ key, type, message, duration = 5000 }) => {
    set((state) => {
      // Deduplicate: match by key if provided, otherwise by type+message
      const duplicate = key
        ? state.toasts.find((t) => t.key === key)
        : state.toasts.find((t) => t.type === type && t.message === message);

      const id = `toast-${Date.now()}-${++counter}`;
      const newToast: Toast = { id, key, type, message, duration };

      if (duplicate) {
        return {
          toasts: state.toasts.map((t) => (t.id === duplicate.id ? newToast : t)),
        };
      }

      const next = [newToast, ...state.toasts];
      return { toasts: next.slice(0, MAX_TOASTS) };
    });
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
