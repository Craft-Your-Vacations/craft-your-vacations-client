"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import Logo from "@/public/logo.png";
import LogoText from "@/public/logo_text.png";
import Button from "../../../../components/Button/Button";
import { useSignOut } from "@/hooks/useSignOut";
import { useUIStore } from "@/stores/useUIStore";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/destinations", label: "Destinations" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const signOut = useSignOut();
  const { adminSidebarOpen, closeAdminSidebar } = useUIStore();

  useEffect(() => {
    closeAdminSidebar();
  }, [pathname]);

  return (
    <>
      {adminSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-overlay/50 md:hidden"
          onClick={closeAdminSidebar}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-screen z-40 bg-surface border-r border-outline flex flex-col overflow-y-auto transition-transform duration-300 w-64 md:w-56 md:translate-x-0 ${adminSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
      <div className="px-5 py-4 border-b border-outline shrink-0 flex items-center gap-3">
        {/* Logo + Admin badge — desktop only; top bar covers this on mobile */}
        <Image src={Logo} alt="CYV Logo" width={36} height={36} className="hidden md:block shrink-0" />
        <div className="hidden md:flex flex-col gap-1">
          <Image src={LogoText} alt="CraftYourVacations" height={18} className="h-[18px] w-auto" />
          <span className="self-start px-1.5 py-0.5 rounded bg-primary/10 text-primary text-label-sm">
            Admin
          </span>
        </div>
        {/* X close button — mobile only */}
        <Button
          variant="ghost"
          size="xs"
          onClick={closeAdminSidebar}
          aria-label="Close sidebar"
          className="md:hidden ml-auto"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
        {NAV_LINKS.map(({ href, label }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`px-3 py-2 rounded-xl text-body-sm transition-colors ${
                isActive
                  ? "bg-primary text-white font-medium"
                  : "text-text-muted hover:bg-surface-high hover:text-text"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-outline shrink-0">
        <Button
          variant="error"
          onClick={() => signOut()}
        >
          Sign out
        </Button>
      </div>
    </aside>
    </>
  );
}
