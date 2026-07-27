import React from "react";
import type { PackageCardData } from "@/app/types/component";
import { Button } from "../Button/Button";
import { Clock } from "lucide-react";

interface PackageCardProps extends PackageCardData {
  highlighted?: boolean;
  className?: string;
}

export function PackageCard({
  title,
  duration,
  features,
  ctaLabel = "View Details",
  href,
  onCtaClick,
  highlighted = false,
  className = "",
}: PackageCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
        highlighted
          ? "bg-surface-high border border-primary/50 shadow-ambient hover:shadow-primary/20 hover:shadow-xl"
          : "bg-surface border border-outline hover:border-primary/30 hover:shadow-lg"
      } ${className}`}
    >
      {/* Gradient accent top bar */}
      <div
        className={`h-1 w-full ${highlighted ? "btn-gradient" : "bg-outline"}`}
      />

      <div className="flex flex-col gap-5 p-6 flex-1">
        {/* Badge + Header */}
        <div className="flex flex-col gap-3">
          {highlighted && (
            <div className="self-start px-3 py-1 rounded-full btn-gradient text-white text-label-sm font-semibold tracking-wide">
              Most Popular
            </div>
          )}
          <div>
            <h3 className="text-headline-md text-text">{title}</h3>
            <div className="flex items-center gap-1.5 text-text-muted text-body-sm mt-1.5">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{duration}</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-outline" />

        {/* Features */}
        <ul className="flex flex-col gap-3 flex-1">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className={`mt-0.5 shrink-0 w-7 h-7 rounded-xl flex items-center justify-center ${
                  highlighted
                    ? "bg-primary/15 text-primary"
                    : "bg-surface-high text-text-muted"
                }`}
              >
                {feature.icon}
              </span>
              <span className="text-body-sm text-text-muted leading-relaxed">
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          variant={highlighted ? "primary" : "secondary"}
          href={href}
          onClick={onCtaClick}
          className="w-full justify-center mt-4"
        >
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}

export default PackageCard;
