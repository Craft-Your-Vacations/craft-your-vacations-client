"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

const CHANNEL = "cyv-email-verified";

// Call after a successful email verify / change (from /verify-email). Signals every
// other open tab that the profile's verification state changed so they can refresh.
// BroadcastChannel is the primary path; a localStorage write is the fallback for
// browsers without it (both are received only by OTHER tabs, never the sender).
export function broadcastEmailVerified() {
  try {
    const bc = new BroadcastChannel(CHANNEL);
    bc.postMessage("verified");
    setTimeout(() => bc.close(), 0);
  } catch {
    // BroadcastChannel unsupported — the storage write below still covers it.
  }
  try {
    localStorage.setItem(CHANNEL, String(Date.now()));
  } catch {
    // storage unavailable (private mode / disabled) — nothing more to do.
  }
}

// Mounted once (inside QueryClientProvider). Invalidates the profile query whenever
// any tab signals the email was verified/changed, so banners/gates update app-wide.
export function useEmailVerifiedSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const invalidate = () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.me() });

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel(CHANNEL);
      bc.onmessage = invalidate;
    } catch {
      // BroadcastChannel unsupported — rely on the storage event below.
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === CHANNEL) invalidate();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      bc?.close();
      window.removeEventListener("storage", onStorage);
    };
  }, [queryClient]);
}
