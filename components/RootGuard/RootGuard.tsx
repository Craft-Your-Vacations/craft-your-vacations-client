"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";
import InactivityDialog from "@/components/InactivityDialog/InactivityDialog";

const PROTECTED_PATHS = ["/profile", "/bookings"];

export function RootGuard({ children }: { children: React.ReactNode }) {
  const status = useAuthStore((s) => s.status);
  const role = useAuthStore((s) => s.role);
  const phoneVerified = useAuthStore((s) => s.phoneVerified);
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = status === "authenticated";

  const { showWarning, countdown, keepSignedIn } =
    useInactivityLogout(isAuthenticated);

  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  useEffect(() => {
    if (status === "loading") return;

    if (role === "Admin") {
      router.replace("/admin");
      return;
    }

    if (isProtected && !isAuthenticated) {
      redirect("/login");
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
      />
      {children}
    </>
  );
}
