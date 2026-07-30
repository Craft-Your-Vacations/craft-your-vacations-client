import { useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";

// Wires Supabase auth into the Zustand auth store. Mount ONCE (in Providers): reads the
// initial session, then keeps the store in sync on every auth change — login, logout,
// and token refresh (proxy middleware refreshes the cookie; onAuthStateChange fires here).
export function useAuthListener() {
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const setSession = useAuthStore.getState().setSession;

    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      setSession(session),
    );

    return () => subscription.unsubscribe();
  }, []);
}
