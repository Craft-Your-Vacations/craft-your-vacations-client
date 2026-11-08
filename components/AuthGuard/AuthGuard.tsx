"use client";

import { selectNeedsOnboarding, useAuthStore } from "@/stores/useAuthStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const status = useAuthStore((s) => s.status);
  const role = useAuthStore((s) => s.role);
  const needsOnboarding = useAuthStore(selectNeedsOnboarding);
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = status === "authenticated";
  const isAuthPage = pathname === "/login";

  useEffect(() => {
    if (status === "loading") return;

    const isOnboarding = pathname === "/onboarding";

    if (!isAuthenticated && isOnboarding) {
      router.replace("/login");
    }

    if (role === "Admin") {
      router.replace("/admin");
      return;
    }

    if (isAuthPage && isAuthenticated) {
      router.replace(needsOnboarding ? "/onboarding" : "/");
    }
  }, [status, role, needsOnboarding, isAuthenticated, pathname, router]);

  if (status === "loading") return <LoadingSpinner />;

  if (role === "Admin") return null;

  if (isAuthPage && isAuthenticated) return null;

  return <main className="min-h-screen bg-bg">{children}</main>;
}
