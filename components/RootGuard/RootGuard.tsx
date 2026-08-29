"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";
import InactivityDialog from "@/components/InactivityDialog/InactivityDialog";

/**
 * Routes that need a session, paired with the `reason` the login page uses to
 * explain itself (see LOGIN_PROMPTS there). Without it the visitor is dropped
 * on a bare login screen with no idea why.
 */
const PROTECTED_PATHS = [
  { path: "/profile", reason: "profile" },
  { path: "/bookings", reason: "bookings" },
];

export function RootGuard({ children }: { children: React.ReactNode }) {
  const status = useAuthStore((s) => s.status);
  const role = useAuthStore((s) => s.role);
  const phoneVerified = useAuthStore((s) => s.phoneVerified);
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = status === "authenticated";

  const { showWarning, countdown, keepSignedIn, signOutNow } =
    useInactivityLogout(isAuthenticated);

  const protectedRoute = PROTECTED_PATHS.find(
    ({ path }) => pathname === path || pathname.startsWith(path + "/"),
  );
  const isProtected = Boolean(protectedRoute);

  useEffect(() => {
    if (status === "loading") return;

    if (role === "Admin") {
      router.replace("/admin");
      return;
    }

    if (protectedRoute && !isAuthenticated) {
      // Carry why they were bounced, and where to return them afterwards.
      const next = encodeURIComponent(pathname);
      redirect(`/login?reason=${protectedRoute.reason}&next=${next}`);
    }

    if (isAuthenticated && !phoneVerified) {
      redirect("/onboarding");
    }
  }, [
    status,
    role,
    phoneVerified,
    isAuthenticated,
    pathname,
    router,
    isProtected,
    protectedRoute?.reason,
  ]);

  // Only block on loading for protected routes. Public routes render immediately —
  // the session resolves quickly and the Navbar updates once it does.
  if (status === "loading" && isProtected) return <LoadingSpinner />;
  if (role === "Admin") return null;
  if (isProtected && !isAuthenticated) return null;
  if (isAuthenticated && !phoneVerified) return null;

  return (
    <>
      <InactivityDialog
        isOpen={showWarning}
        countdown={countdown}
        onKeepSignedIn={keepSignedIn}
        onSignOut={signOutNow}
      />
      {children}
    </>
  );
}
