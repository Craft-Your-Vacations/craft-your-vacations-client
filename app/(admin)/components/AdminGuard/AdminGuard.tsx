"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";
import InactivityDialog from "@/components/InactivityDialog/InactivityDialog";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const status = useAuthStore((s) => s.status);
  const role = useAuthStore((s) => s.role);
  const isAuthenticated = status === "authenticated";
  const { showWarning, countdown, keepSignedIn, signOutNow } =
    useInactivityLogout(isAuthenticated && role === "Admin");

  useEffect(() => {
    if (status === "loading") return;

    if (!isAuthenticated) {
      redirect("/login");
      return;
    }

    if (role !== "Admin") {
      redirect("/");
    }
  }, [status, role, isAuthenticated]);

  if (status === "loading") return <LoadingSpinner />;
  if (!isAuthenticated) return null;
  if (role !== "Admin") return null;

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
