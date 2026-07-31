import { create } from "zustand";

type OnboardingStep = "phone" | "otp" | "email" | "profile";

const STEP_ORDER: OnboardingStep[] = ["phone", "otp", "email", "profile"];

interface OnboardingStore {
  step: OnboardingStep;
  phone: string;
  setPhone: (phone: string) => void;
  nextStep: () => void;
  editPhone: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  step: "phone",
  phone: "",
  setPhone: (phone) => set({ phone }),
  nextStep: () => {
    const currentIndex = STEP_ORDER.indexOf(get().step);
    const next = STEP_ORDER[currentIndex + 1];
    if (next) set({ step: next });
  },
  // Return to the phone step so a mistyped number can be corrected (the number
  // stays in `phone`, so PhoneStep pre-fills it for editing).
  editPhone: () => set({ step: "phone" }),
  reset: () => set({ step: "phone", phone: "" }),
}));
