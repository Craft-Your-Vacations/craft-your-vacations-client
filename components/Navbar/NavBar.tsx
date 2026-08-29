"use client";

import React, { useEffect, useState } from "react";
import type { NavLink } from "@/app/types/component";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { CircleUser, Menu, X } from "lucide-react";
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
];

/** Element id the home hero exposes so the navbar can observe it (see HeroSection). */
const HERO_ID = "hero-sentinel";

export function Navbar({ links = defaultLinks, className = "" }: NavbarProps) {
  const pathname = usePathname();
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();

  const status = useAuthStore((s) => s.status);
  const isSessionLoading = status === "loading";
  const isUserLogged = status === "authenticated";

  // Routes that render a full-screen hero (home + the destinations index +
  // destination/package details) exposing an element with id="hero-sentinel".
  // Computed from the path so the navbar starts transparent immediately (no
  // flash) without a setState.
  const pathHasHero =
    pathname === "/" ||
    pathname === "/bookings" ||
    /^\/destinations(\/[^/]+(\/packages\/[^/]+)?)?\/?$/.test(pathname);

  // On hero routes the navbar floats transparently over the photo and turns
  // solid once the hero scrolls out of view. Optimistically true so the top of
  // the page is transparent before the observer attaches; the async observer
  // callbacks are the only writers (keeps this effect setState-free).
  const [heroInView, setHeroInView] = useState(true);

  useEffect(() => {
    if (!pathHasHero) return;
    let io: IntersectionObserver | null = null;

    const attach = (hero: Element) => {
      io = new IntersectionObserver(
        ([entry]) => setHeroInView(entry.isIntersecting),
        // Offset the top edge by the navbar height so the flip lands exactly
        // when the hero passes under the bar.
        { rootMargin: "-80px 0px 0px 0px", threshold: 0 },
      );
      io.observe(hero);
    };

    // Detail pages render a spinner first, then the hero — watch for it.
    let mo: MutationObserver | null = null;
    const existing = document.getElementById(HERO_ID);
    if (existing) {
      attach(existing);
    } else {
      mo = new MutationObserver(() => {
        const hero = document.getElementById(HERO_ID);
        if (hero) {
          mo?.disconnect();
          attach(hero);
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      mo?.disconnect();
      io?.disconnect();
    };
  }, [pathHasHero, pathname]);

  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  const overlay = pathHasHero && heroInView && !mobileMenuOpen;

  // Shared overlay treatment for the round icon buttons (theme toggle, profile,
  // hamburger) so they read on the photo.
  const iconOverlayClass = overlay
    ? "!bg-white/10 !text-white hover:!bg-white/20 border border-white/25 backdrop-blur-sm"
    : "";

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        overlay
          ? "bg-transparent border-b border-transparent"
          : "bg-surface border-b border-outline shadow-ambient"
      } ${className}`}
    >
      {/* Legibility scrim behind the bar while overlaid on the photo */}
      {overlay && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/55 to-transparent"
        />
      )}

      <div className="relative mx-auto max-w-(--container-max-w) px-6 md:px-10 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" replace className="flex items-center justify-center gap-2">
          <Image src={Logo} alt="Logo" className="w-10" />
          <Image src={LogoText} alt="Logo" className="w-25" />
        </Link>

        {/* Desktop links + actions grouped on the right */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <ul className="flex items-center gap-1">
          {links.map((link) => {
            const isActive = link.href === pathname;
            const linkColor = overlay
              ? isActive
                ? "text-white"
                : "text-white/75 hover:text-white"
              : isActive
                ? "text-primary"
                : "text-text-muted hover:text-text";
            return (
              <li key={link.href}>
                <Link href={link.href} replace={link.replace}>
                  <div
                    className={`px-4 py-2 text-body-md transition-colors relative pb-0.5 ${linkColor}`}
                  >
                    <span className="relative inline-block">
                      {link.label}
                      {isActive && (
                        <span
                          className={`absolute left-1/2 -translate-x-1/2 bottom-0 h-px w-full rounded-full ${
                            overlay ? "bg-white" : "bg-primary"
                          }`}
                        />
                      )}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
          </ul>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <ToggleTheme className={iconOverlayClass} />
          {isSessionLoading ? (
            <div
              className={`w-12 h-12 rounded-full animate-pulse ${
                overlay ? "bg-white/15" : "bg-surface-high"
              }`}
            />
          ) : isUserLogged ? (
            <Button
              variant="icon"
              href="/profile"
              aria-label="Profile"
              className={iconOverlayClass}
            >
              <CircleUser className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              href="/login"
              variant={overlay ? "secondary" : "primary"}
              className={
                overlay
                  ? "!border-white/40 !text-white hover:!bg-white/10 backdrop-blur-sm"
                  : ""
              }
            >
              Login
            </Button>
          )}
          </div>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          <ToggleTheme className={iconOverlayClass} />
          <Button
            variant="icon"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={toggleMobileMenu}
            className={iconOverlayClass}
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
              className={`px-4 py-3 rounded-xl text-body-md transition-colors ${
                link.href === pathname
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
              className="px-4 py-3 rounded-xl text-body-md transition-colors text-text-muted hover:text-text hover:bg-surface-high"
            >
              Profile
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-4 py-3 rounded-xl text-body-md transition-colors text-text-muted hover:text-text hover:bg-surface-high"
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
