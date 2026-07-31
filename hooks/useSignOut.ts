import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Soft sign-out: end the Supabase session, drop ALL cached server data (so the previous
// user's profile/bookings/documents can't linger in React Query), then client-navigate.
// No full page reload — signing out fires SIGNED_OUT, which flips the auth store.
// NOTE: do NOT call router.refresh() here — after router.replace() it re-renders the
// CURRENT (protected) route before the navigation commits, which cancels the redirect
// and leaves a blank guard-null screen. The replace alone navigates cleanly.
export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useCallback(
    async (redirectTo: string = "/login") => {
      await getSupabaseBrowserClient().auth.signOut();
      queryClient.clear();
      router.replace(redirectTo);
    },
    [queryClient, router],
  );
}
