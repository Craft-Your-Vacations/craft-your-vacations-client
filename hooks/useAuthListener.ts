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

    // A rejected getSession (e.g. a stale/invalid refresh token that fails at the
    // network level) must still resolve the store out of "loading" — otherwise the
    // guards render null forever and the page never paints. Purge the bad local
    // session so the failing refresh doesn't retry on the next mount.
    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session))
      .catch(() => {
        console.log("Error getting session");
        setSession(null);
        void supabase.auth.signOut({ scope: "local" });
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      setSession(session),
    );

    return () => subscription.unsubscribe();
  }, []);
}
