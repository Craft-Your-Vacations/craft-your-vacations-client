import { useCallback, useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const COUNTDOWN_SECONDS = 30;
const COUNTDOWN_MS = COUNTDOWN_SECONDS * 1000;
const LAST_ACTIVITY_KEY = "cyv_last_activity";
const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
  "click",
] as const;

function getElapsedIdle(): number {
  const stored = localStorage.getItem(LAST_ACTIVITY_KEY);
  return stored ? Date.now() - Number(stored) : 0;
}

function recordActivity() {
  localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
}

export function useInactivityLogout(active: boolean) {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);

  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const warningActiveRef = useRef(false);

  const startLogoutCountdown = useCallback(() => {
    warningActiveRef.current = true;
    setShowWarning(true);
    setCountdown(COUNTDOWN_SECONDS);

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current!);
          countdownIntervalRef.current = null;
          localStorage.removeItem(LAST_ACTIVITY_KEY);
          signOut({ redirect: false }).then(() => {
            window.location.replace("/login");
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (warningActiveRef.current) return;
    recordActivity();
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(startLogoutCountdown, INACTIVITY_TIMEOUT_MS - COUNTDOWN_MS);
  }, [startLogoutCountdown]);

  const keepSignedIn = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    warningActiveRef.current = false;
    setShowWarning(false);
    setCountdown(COUNTDOWN_SECONDS);
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  useEffect(() => {
    if (!active) return;

    const elapsed = getElapsedIdle();

    if (elapsed >= INACTIVITY_TIMEOUT_MS) {
      // Gone for the full timeout — sign out immediately
      localStorage.removeItem(LAST_ACTIVITY_KEY);
      signOut({ redirect: false }).then(() => {
        window.location.replace("/");
      });
      return;
    }

    // Reopening the tab counts as activity — always reset to full timer
    resetInactivityTimer();

    const handleActivity = () => resetInactivityTimer();
    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, handleActivity, { passive: true }),
    );

    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, handleActivity),
      );
    };
  }, [active, resetInactivityTimer]);

  return { showWarning, countdown, keepSignedIn };
}
