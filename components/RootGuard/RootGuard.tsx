"use client";
import { signOut, useSession } from "next-auth/react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";
import InactivityDialog from "@/components/InactivityDialog/InactivityDialog";

const PROTECTED_PATHS = ["/profile", "/bookings"];

export function RootGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const { showWarning, countdown, keepSignedIn } = useInactivityLogout(
    !!session && status === "authenticated",
  );

  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  useEffect(() => {
    if (status === "loading") return;

    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/login" });
      return;
    }

    if (session?.user?.role === "Admin") {
      router.replace("/admin");
      return;
    }

    if (isProtected && !session) {
      redirect("/login");
    }

    if (session && session.user.phoneVerified === false) {
      redirect("/onboarding");
    }
  }, [session, status, pathname, router, isProtected]);

  // Only block on loading for protected routes. Public routes (e.g. "/") render
  // immediately — SessionProvider's initial fetch resolves quickly and the Navbar
  // will update once it does. Blocking all routes causes a permanent spinner when
  // the page is restored from bfcache with status frozen at "loading".
  if (status === "loading" && isProtected) return <LoadingSpinner />;
  if (session?.error === "RefreshAccessTokenError") return null;
  if (session?.user?.role === "Admin") return null;
  if (isProtected && !session) return null;
  if (session && session.user.phoneVerified === false) return null;

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
