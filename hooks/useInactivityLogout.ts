import { useCallback, useEffect, useRef, useState } from "react";
import { useSignOut } from "@/hooks/useSignOut";

// Idle timeout is configurable via env (NEXT_PUBLIC_ so the value reaches the
// browser); falls back to 15 minutes when unset or invalid.
// NOTE: NEXT_PUBLIC_ vars are inlined at build time — a rebuild is required to
// change them; they cannot be swapped at runtime.
function envNumber(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

const INACTIVITY_TIMEOUT_MS =
  envNumber(process.env.NEXT_PUBLIC_INACTIVITY_TIMEOUT_MINUTES, 60) * 60 * 1000;
const COUNTDOWN_SECONDS = 30;
const COUNTDOWN_MS = COUNTDOWN_SECONDS * 1000;
// Idle duration at which the "Still there?" warning appears (timeout minus the
// countdown window), so warning + countdown together equal the full timeout.
const WARNING_AT_MS = INACTIVITY_TIMEOUT_MS - COUNTDOWN_MS;

const LAST_ACTIVITY_KEY = "cyv_last_activity";
const CHANNEL_NAME = "cyv_inactivity";

// We do NOT trust a single long setTimeout: browsers throttle timers in hidden/
// backgrounded tabs, so the fire time drifts. Instead we store the last-activity
// timestamp and re-derive idle time on a short poll + on tab refocus, which makes
// throttling irrelevant. localStorage is the single cross-tab source of truth;
// BroadcastChannel propagates activity/logout so tabs stay in lockstep.
const POLL_INTERVAL_MS = 4_000;
const COUNTDOWN_TICK_MS = 250;
const ACTIVITY_WRITE_THROTTLE_MS = 2_000;

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
  "click",
] as const;

function readLastActivity(): number {
  const stored = localStorage.getItem(LAST_ACTIVITY_KEY);
  const n = stored ? Number(stored) : NaN;
  return Number.isFinite(n) ? n : Date.now();
}

export function useInactivityLogout(active: boolean) {
  const signOut = useSignOut();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);

  const warningActiveRef = useRef(false);
  const lastWriteRef = useRef(0);
  // Populated by the effect so the returned callbacks always call the live
  // implementation without re-subscribing listeners on every render.
  const keepSignedInRef = useRef<() => void>(() => {});
  const signOutNowRef = useRef<() => void>(() => {});

  const keepSignedIn = useCallback(() => keepSignedInRef.current(), []);
  // Explicit "Sign Out" from the dialog. Routes through doSignOut so it
  // broadcasts to other tabs — never sign out directly from the dialog.
  const signOutNow = useCallback(() => signOutNowRef.current(), []);

  useEffect(() => {
    if (!active) return;

    let channel: BroadcastChannel | null = null;
    let pollTimer: ReturnType<typeof setInterval> | null = null;
    let countdownTimer: ReturnType<typeof setInterval> | null = null;
    let signedOut = false;

    function broadcast(type: "activity" | "logout") {
      channel?.postMessage({ type });
    }

    function clearCountdown() {
      if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
      }
    }

    function clearTimers() {
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
      clearCountdown();
    }

    // propagate=false when we're reacting to another tab's logout (avoid echo).
    function doSignOut(redirectTo: string, propagate: boolean) {
      if (signedOut) return;
      signedOut = true;
      if (propagate) broadcast("logout");
      localStorage.removeItem(LAST_ACTIVITY_KEY);
      clearTimers();
      signOut(redirectTo);
    }

    function stopWarning() {
      clearCountdown();
      warningActiveRef.current = false;
      setShowWarning(false);
      setCountdown(COUNTDOWN_SECONDS);
    }

    function recordActivity(force: boolean) {
      const now = Date.now();
      if (!force && now - lastWriteRef.current < ACTIVITY_WRITE_THROTTLE_MS) return;
      lastWriteRef.current = now;
      localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
      broadcast("activity");
    }

    function tickCountdown() {
      const idle = Date.now() - readLastActivity();
      // Activity in another tab pushed the deadline out — dismiss the warning.
      if (idle < WARNING_AT_MS) {
        stopWarning();
        return;
      }
      const remainingMs = INACTIVITY_TIMEOUT_MS - idle;
      if (remainingMs <= 0) {
        doSignOut("/login", true);
        return;
      }
      setCountdown(Math.max(1, Math.ceil(remainingMs / 1000)));
    }

    function startWarning() {
      if (warningActiveRef.current) return;
      warningActiveRef.current = true;
      setShowWarning(true);
      tickCountdown();
      countdownTimer = setInterval(tickCountdown, COUNTDOWN_TICK_MS);
    }

    function evaluate() {
      if (signedOut || warningActiveRef.current) return;
      const idle = Date.now() - readLastActivity();
      if (idle >= INACTIVITY_TIMEOUT_MS) {
        doSignOut("/login", true);
        return;
      }
      if (idle >= WARNING_AT_MS) startWarning();
    }

    // --- Initial mount: honor time already spent idle (e.g. tab was closed) ---
    const storedOnMount = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (storedOnMount && Date.now() - Number(storedOnMount) >= INACTIVITY_TIMEOUT_MS) {
      localStorage.removeItem(LAST_ACTIVITY_KEY);
      signOut("/");
      return;
    }
    // Opening / returning to the app counts as activity.
    recordActivity(true);

    // --- Listeners ---
    const handleActivity = () => {
      // Same-tab activity is ignored once the warning shows: the user must make
      // an explicit choice. Genuine activity in ANOTHER tab still resets us
      // (handled via the "activity" broadcast / storage event below).
      if (warningActiveRef.current) return;
      recordActivity(false);
    };

    const handleVisibility = () => {
      if (document.visibilityState !== "visible") return;
      // Re-evaluate immediately on refocus instead of waiting for the next poll.
      if (warningActiveRef.current) tickCountdown();
      else evaluate();
    };

    const handleStorage = (e: StorageEvent) => {
      // Fallback for cross-tab activity when BroadcastChannel is unavailable.
      if (e.key === LAST_ACTIVITY_KEY && warningActiveRef.current) tickCountdown();
    };

    if (typeof BroadcastChannel !== "undefined") {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = (e: MessageEvent) => {
        const type = e.data?.type;
        if (type === "logout") doSignOut("/login", false);
        else if (type === "activity" && warningActiveRef.current) tickCountdown();
      };
    }

    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, handleActivity, { passive: true }),
    );
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("storage", handleStorage);

    pollTimer = setInterval(evaluate, POLL_INTERVAL_MS);

    keepSignedInRef.current = () => {
      recordActivity(true);
      stopWarning();
    };
    // propagate=true so the other tabs also sign out and drop their dialogs.
    signOutNowRef.current = () => doSignOut("/login", true);

    return () => {
      clearTimers();
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, handleActivity),
      );
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("storage", handleStorage);
      channel?.close();
    };
  }, [active, signOut]);

  return { showWarning, countdown, keepSignedIn, signOutNow };
}
