import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackLinkProps {
  href: string;
  label: string;
  /** onSurface for cards and page headers; onImage over photography. */
  variant?: "onSurface" | "onImage";
  className?: string;
}

/** "Back to <list>" link for a detail page. */
export default function BackLink({
  href,
  label,
  variant = "onSurface",
  className,
}: BackLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex w-fit items-center gap-1.5 text-body-sm transition-colors",
        variant === "onImage"
          ? "text-white/70 hover:text-white"
          : "text-text-muted hover:text-primary",
        className,
      )}
    >
      <ChevronLeft className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  );
}
