import { create } from "zustand";
import type { Session } from "@supabase/supabase-js";
import { decodeClaims } from "@/lib/supabase/claims";

type Status = "loading" | "authenticated" | "unauthenticated";

interface AuthStore {
  status: Status;
  /** Supabase auth user id (uuid) — the `sub` claim. */
  userId: string | null;
  email: string | null;
  /** App role from the `user_role` custom claim (injected by the access-token hook). */
  role: string | null;
  /** From the `phone_verified` custom claim — half of the onboarding gate. */
  phoneVerified: boolean;
  /**
   * From the `has_name` custom claim. A phone sign-up is created from the number
   * alone, so it is phone-verified from the start but has no name — this is what
   * still sends it through onboarding.
   */
  hasName: boolean;
  /** Replace the whole auth snapshot from a Supabase session (null on sign-out). */
  setSession: (session: Session | null) => void;
}

// Global auth state, kept in sync with Supabase by useAuthListener (mounted once in
// Providers). Read with selectors, e.g. `useAuthStore((s) => s.role)`, so a component
// only re-renders when the field it reads changes.
export const useAuthStore = create<AuthStore>((set) => ({
  status: "loading",
  userId: null,
  email: null,
  role: null,
  phoneVerified: false,
  hasName: false,
  setSession: (session) => {
    // Custom claims (user_role, phone_verified, has_name) live in the JWT
    // payload, not on session.user — decode the access token to read them.
    const claims = decodeClaims(session?.access_token);
    set({
      status: session ? "authenticated" : "unauthenticated",
      userId: session?.user?.id ?? null,
      email: session?.user?.email ?? null,
      role: claims.user_role ?? null,
      phoneVerified: Boolean(claims.phone_verified),
      hasName: Boolean(claims.has_name),
    });
  },
}));

/**
 * Onboarding is required until the user has BOTH a verified phone and a name.
 * Neither claim is sufficient alone: a Google sign-in brings a name but no
 * phone, a phone sign-in brings a verified phone but no name.
 */
export const selectNeedsOnboarding = (s: AuthStore) =>
  !s.phoneVerified || !s.hasName;
