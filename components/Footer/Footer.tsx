import React from "react";
import type { NavLink, FooterAction } from "@/app/types/component";

interface FooterProps {
  logo?: React.ReactNode;
  tagline?: string;
  linkGroups?: Array<{ heading: string; links: NavLink[] }>;
  actions?: FooterAction[];
  copyrightText?: string;
  className?: string;
}

const defaultLinkGroups = [
  {
    heading: "Explore",
    links: [
      { label: "Destinations", href: "#destinations" },
      { label: "Packages", href: "#packages" },
      { label: "Experiences", href: "#experiences" },
      { label: "Blog", href: "#blog" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Press", href: "#press" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help Centre", href: "#help" },
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Accessibility", href: "#accessibility" },
    ],
  },
];

const defaultActions: FooterAction[] = [
  { icon: "language", label: "Language" },
  { icon: "dark_mode", label: "Theme" },
  { icon: "rss_feed", label: "RSS Feed" },
];

export function Footer({
  logo,
  tagline = "Crafting unforgettable journeys for the modern explorer.",
  linkGroups = defaultLinkGroups,
  actions = defaultActions,
  copyrightText,
  className = "",
}: FooterProps) {
  const year = new Date().getFullYear();
  const copyright =
    copyrightText ?? `© ${year} CraftVacations. All rights reserved.`;

  return (
    <footer className={`bg-surface-low border-t border-outline ${className}`}>
      <div className="mx-auto max-w-(--container-max-w) px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            {logo ?? (
              <span className="text-headline-sm text-text">
                <span className="text-primary">Craft</span>Vacations
              </span>
            )}
            <p className="text-body-sm text-text-muted">{tagline}</p>
            <div className="flex items-center gap-2 mt-2">
              {actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.onClick}
                  aria-label={action.label}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-high hover:bg-surface-highest text-text-muted hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {action.icon}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {linkGroups.map((group) => (
            <div key={group.heading} className="flex flex-col gap-4">
              <h4 className="text-label-md text-text-subtle">
                {group.heading}
              </h4>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-body-sm text-text-muted hover:text-text transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-outline mt-12 pt-8">
          <p className="text-body-sm text-text-subtle text-center">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
