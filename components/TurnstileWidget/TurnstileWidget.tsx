"use client";

import { useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

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
   * The Cloudflare script could not be fetched — almost always an ad blocker,
   * since challenges.cloudflare.com appears on some blocklists. Without this the
   * form would sit with a disabled button and no explanation.
   */
  onUnavailable?: () => void;
  /**
   * Bump to force a fresh token. Turnstile tokens are single-use and short-lived
   * (~5 min), so one cannot be reused across two auth calls — every attempt
   * needs its own.
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
  onUnavailable,
  resetKey = 0,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  // Kept in a ref so re-rendering with a new closure doesn't re-create the
  // widget, which would discard a token the user already solved for.
  const onTokenRef = useRef(onToken);
  const onUnavailableRef = useRef(onUnavailable);
  useEffect(() => {
    onTokenRef.current = onToken;
    onUnavailableRef.current = onUnavailable;
  }, [onToken, onUnavailable]);

  useEffect(() => {
    if (!SITE_KEY) return;

    let cancelled = false;

    void loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || widgetIdRef.current) return;
        if (!window.turnstile) return;

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          callback: (token) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(null),
          "error-callback": () => onTokenRef.current(null),
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
        // Script blocked (ad blocker, network). Tell the form, so it can say so
        // instead of leaving a dead button with no explanation.
        if (cancelled) return;
        onTokenRef.current(null);
        onUnavailableRef.current?.();
      });

    return () => {
      cancelled = true;
      const id = widgetIdRef.current;
      if (id && window.turnstile) {
        window.turnstile.remove(id);
        widgetIdRef.current = null;
      }
    };
  }, []);

  // Reset on demand. Skips the first run: there is no token to clear yet, and
  // resetting an unrendered widget throws.
  const lastResetRef = useRef(resetKey);
  useEffect(() => {
    if (lastResetRef.current === resetKey) return;
    lastResetRef.current = resetKey;
    const id = widgetIdRef.current;
    if (id && window.turnstile) {
      window.turnstile.reset(id);
      onTokenRef.current(null);
    }
  }, [resetKey]);

  if (!SITE_KEY) return null;

  return <div ref={containerRef} className="flex justify-center" />;
}
