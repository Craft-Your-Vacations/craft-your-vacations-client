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
  /** From the `phone_verified` custom claim — drives the onboarding gate. */
  phoneVerified: boolean;
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
  setSession: (session) => {
    // Custom claims (user_role, phone_verified) live in the JWT payload, not on
    // session.user — decode the access token to read them.
    const claims = decodeClaims(session?.access_token);
    set({
      status: session ? "authenticated" : "unauthenticated",
      userId: session?.user?.id ?? null,
      email: session?.user?.email ?? null,
      role: claims.user_role ?? null,
      phoneVerified: Boolean(claims.phone_verified),
    });
  },
}));
