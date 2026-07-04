"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    if (status === "loading") return;

    const isOnboarding = pathname === "/onboarding";

    if (!session && isOnboarding) {
      router.replace("/login");
    }

    if (session?.user?.role === "Admin") {
      router.replace("/admin");
      return;
    }

    if (isAuthPage && session) {
      router.replace(session.user?.phoneVerified ? "/" : "/onboarding");
    }
  }, [session, status, pathname, router]);

  if (status === "loading") return <LoadingSpinner />;

  if (session?.user?.role === "Admin") return null;

  if (isAuthPage && session) return null;

  return <main className="min-h-screen bg-bg">{children}</main>;
}
