import React from "react";

export type ButtonVariant = "primary" | "secondary" | "error" | "icon" | "overlay" | "text" | "ghost";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
  replace?: boolean;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  bgClass: string;
}

export interface TypographyVariant {
  label: string;
  sampleText: string;
  className: string;
  meta?: string;
}

export interface DestinationCardData {
  imagePath: string;
  destinationCities: string[];
  title: string;
  content: string;
  href?: string;
}

export interface PackageFeature {
  icon: React.ReactNode;
  text: string;
}

export interface PackageCardData {
  title: string;
  duration: string;
  features: PackageFeature[];
  ctaLabel?: string;
  href?: string;
  onCtaClick?: () => void;
}

export interface TestimonialData {
  quote: string;
  authorName: string;
  authorTitle?: string;
  authorAvatarUrl?: string;
  authorAvatarAlt?: string;
}

export interface FooterAction {
  icon: string;
  label: string;
  onClick?: () => void;
}

export interface FieldBaseProps {
  id: string;
  /** Optional — omit for compact/inline fields (e.g. search boxes, table-row editors). */
  label?: string;
  helperText?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// types/Api.ts
