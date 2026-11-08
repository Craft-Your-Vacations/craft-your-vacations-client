"use client";

import { useCallback, useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/**
 * How long a failing challenge gets to recover before we tell the user.
 *
 * Turnstile's `retry` option defaults to "auto" with a ~8s interval, so retries
 * land at roughly t+8, t+16 and t+24. 25s therefore covers three of them. The
 * errors that show up here are mostly transient — 110600 is literally "challenge
 * timed out", which a slow connection produces — so reporting the first one
 * would cry failure over something that fixes itself seconds later.
 */
const FAILURE_GRACE_MS = 25_000;

/**
 * Whether CAPTCHA is switched on for this deployment.
 *
 * The whole feature is gated on the sitekey being present, which is what makes
 * enabling it safe: Supabase refuses *every* auth call without a token once the
 * dashboard toggle is on, so code and config would otherwise have to land in
 * lockstep. Instead this ships inert, you confirm the widget renders and issues
 * tokens, and only then flip the toggle. Unsetting the variable rolls it back.
 */
export const isCaptchaEnabled = Boolean(SITE_KEY);

interface TurnstileApi {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
      theme?: "auto" | "light" | "dark";
      appearance?: "always" | "execute" | "interaction-only";
    },
  ) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

/** Load the Turnstile script once per page, however many widgets mount. */
function loadScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    if (window.turnstile) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("turnstile")));
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("turnstile"));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

interface TurnstileWidgetProps {
  /** Receives the token, or null when it expires, errors, or is reset. */
  onToken: (token: string | null) => void;
  /**
   * The Cloudflare script could not be fetched at all — almost always an ad
   * blocker, since challenges.cloudflare.com appears on some blocklists. There
   * is no widget to retry against, so this one is terminal.
   */
  onBlocked?: () => void;
  /**
   * The widget loaded, but the challenge kept failing for longer than
   * FAILURE_GRACE_MS. Distinct from onBlocked because this IS recoverable —
   * the caller should offer a manual retry (bump `resetKey`), not a dead end.
   */
  onFailed?: () => void;
  /**
   * Bump to force a fresh token. Turnstile tokens are single-use and short-lived
   * (~5 min), so one cannot be reused across two auth calls — every attempt
   * needs its own. Also abandons any failure countdown in flight.
   */
  resetKey?: number;
}

/**
 * Cloudflare Turnstile, in Managed mode. Renders nothing at all when no sitekey
 * is configured, so callers can mount it unconditionally.
 *
 * Managed mode is normally invisible — no puzzle for a legitimate visitor — so
 * this usually occupies no visible space even when active.
 */
export default function TurnstileWidget({
  onToken,
  onBlocked,
  onFailed,
  resetKey = 0,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const failureTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Kept in refs so re-rendering with a new closure doesn't re-create the
  // widget, which would discard a token the user already solved for.
  const onTokenRef = useRef(onToken);
  const onBlockedRef = useRef(onBlocked);
  const onFailedRef = useRef(onFailed);
  useEffect(() => {
    onTokenRef.current = onToken;
    onBlockedRef.current = onBlocked;
    onFailedRef.current = onFailed;
  }, [onToken, onBlocked, onFailed]);

  // Empty deps, so its identity is stable and naming it as a dependency below
  // never re-runs an effect (which would remount the widget).
  const cancelFailureCountdown = useCallback(() => {
    if (!failureTimerRef.current) return;
    clearTimeout(failureTimerRef.current);
    failureTimerRef.current = null;
  }, []);

  useEffect(() => {
    if (!SITE_KEY) return;

    let cancelled = false;

    void loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || widgetIdRef.current) return;
        if (!window.turnstile) return;

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          callback: (token) => {
            // A retry landed — withdraw the verdict we were counting down to.
            cancelFailureCountdown();
            onTokenRef.current(token);
          },
          "expired-callback": () => onTokenRef.current(null),
          "error-callback": () => {
            onTokenRef.current(null);
            // Don't report the first failure: Turnstile is already retrying,
            // and these errors are usually transient. Start one countdown and
            // let `callback` cancel it, so a slow-but-eventual success stays
            // silent and only a sustained failure reaches the user.
            if (failureTimerRef.current) return;
            failureTimerRef.current = setTimeout(() => {
              failureTimerRef.current = null;
              onFailedRef.current?.();
            }, FAILURE_GRACE_MS);
          },
          theme: "auto",
          // Render nothing unless Cloudflare actually needs the user to do
          // something. The default ("always") leaves a white Cloudflare badge
          // sitting inside the auth card for every visitor, which does not
          // belong in a glass panel — and says nothing useful, since a passing
          // check is the normal case.
          appearance: "interaction-only",
        });
      })
      .catch(() => {
        // Script blocked (ad blocker, network). No widget exists, so there is
        // nothing to retry — report it straight away rather than after a wait.
        if (cancelled) return;
        onTokenRef.current(null);
        onBlockedRef.current?.();
      });

    return () => {
      cancelled = true;
      cancelFailureCountdown();
      const id = widgetIdRef.current;
      if (id && window.turnstile) {
        window.turnstile.remove(id);
        widgetIdRef.current = null;
      }
    };
  }, [cancelFailureCountdown]);

  // Reset on demand. Skips the first run: there is no token to clear yet, and
  // resetting an unrendered widget throws.
  const lastResetRef = useRef(resetKey);
  useEffect(() => {
    if (lastResetRef.current === resetKey) return;
    lastResetRef.current = resetKey;
    // A fresh attempt supersedes whatever the old one was failing at.
    cancelFailureCountdown();
    const id = widgetIdRef.current;
    if (id && window.turnstile) {
      window.turnstile.reset(id);
      onTokenRef.current(null);
    }
  }, [resetKey, cancelFailureCountdown]);

  if (!SITE_KEY) return null;

  return <div ref={containerRef} className="flex justify-center" />;
}
