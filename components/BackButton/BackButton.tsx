"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Button from "@/components/Button/Button";
import type { ButtonSize } from "@/app/types/component";

interface BackButtonProps {
  /** "overlay" for use on top of dark hero imagery; "icon" (default) on normal surfaces. */
  variant?: "icon" | "overlay";
  size?: ButtonSize;
  className?: string;
}

// Generic chevron-only back control. Always goes to the previous history entry
// (router.back()) — it never navigates to a fixed route.
export default function BackButton({
  variant = "icon",
  size = "sm",
  className = "",
}: BackButtonProps) {
  const router = useRouter();
  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => router.back()}
      aria-label="Go back"
      className={className}
    >
      <ChevronLeft className="w-5 h-5" />
    </Button>
  );
}
