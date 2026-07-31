"use client";

import React, { useEffect } from "react";
import type { NavLink } from "@/app/types/component";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Search, CircleUser, Menu, X } from "lucide-react";
import Logo from "@/public/logo.png";
import LogoText from "@/public/logo_text.png";
import ToggleTheme from "@/components/ToggleTheme/ToggleTheme";
import Link from "next/link";
import Button from "../Button/Button";
import { useUIStore } from "@/stores/useUIStore";
import { useAuthStore } from "@/stores/useAuthStore";

interface NavbarProps {
  logo?: React.ReactNode;
  links?: NavLink[];
  className?: string;
}

const defaultLinks: NavLink[] = [
  { label: "Home", href: "/", replace: true },
  { label: "Destinations", href: "/destinations" },
  { label: "My Bookings", href: "/bookings" },
  // { label: "Components", href: "/components" }, // internal design-system demo — hidden for now
];

export function Navbar({ links = defaultLinks, className = "" }: NavbarProps) {
  const pathname = usePathname();
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();

  const status = useAuthStore((s) => s.status);
  const isSessionLoading = status === "loading";
  const isUserLogged = status === "authenticated";

  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 bg-surface border-b border-outline shadow-sm shadow-primary/10 ${className}`}
    >
      <div className="mx-auto max-w-(--container-max-w) px-6 md:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          replace
          className="flex items-center justify-center gap-2"
        >
          <Image src={Logo} alt="Logo" className="w-10" />
          <Image src={LogoText} alt="Logo" className="w-25" />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = link.href === pathname;
            return (
              <li key={link.href}>
                <Link href={link.href} replace={link.replace}>
                  <div
                    className={`px-4 py-2 text-body-md transition-colors relative pb-0.5 ${
                      isActive
                        ? "text-primary"
                        : "text-text-muted hover:text-text"
                    }`}
                  >
                    <span className="relative inline-block">
                      {link.label}
                      {isActive && (
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-0 h-px w-full bg-primary rounded-full" />
                      )}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Action buttons */}
        <div className="hidden md:flex items-center gap-2">
          <ToggleTheme />
          {isSessionLoading ? (
            <div className="w-12 h-12 rounded-full bg-surface-high animate-pulse" />
          ) : isUserLogged ? (
            <Button variant="icon" href="/profile" aria-label="Profile">
              <CircleUser className="w-5 h-5" />
            </Button>
          ) : (
            <Button href="/login">Login</Button>
          )}
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          <ToggleTheme />
          <Button
            variant="icon"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-outline px-6 py-4 flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-3 rounded-lg text-body-md transition-colors ${
                link.isActive
                  ? "text-primary bg-primary/10"
                  : "text-text-muted hover:text-text hover:bg-surface-high"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isSessionLoading ? null : isUserLogged ? (
            <Link
              href="/profile"
              className="px-4 py-3 rounded-lg text-body-md transition-colors text-text-muted hover:text-text hover:bg-surface-high"
            >
              Profile
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-4 py-3 rounded-lg text-body-md transition-colors text-text-muted hover:text-text hover:bg-surface-high"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
