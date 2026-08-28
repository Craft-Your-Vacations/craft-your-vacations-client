import Image from "next/image";
import { cn } from "@/lib/utils";

type AvatarVariant = "onImage" | "onSurface";

interface AvatarProps {
  name: string;
  /** When provided, shows the photo; otherwise falls back to initials. */
  imageUrl?: string;
  imageAlt?: string;
  /**
   * - onImage  : white glass, for avatars sitting over photography
   * - onSurface: primary tint, for avatars on card / surface backgrounds
   */
  variant?: AvatarVariant;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const variantClasses: Record<AvatarVariant, string> = {
  onImage: "bg-white/10 border-2 border-white/30 backdrop-blur-sm text-white",
  onSurface: "bg-primary/15 border-2 border-primary/25 text-primary",
};

// Circular avatar: the person's photo when available, else their initials.
// The single source of truth for author / reviewer avatars.
export function Avatar({
  name,
  imageUrl,
  imageAlt,
  variant = "onSurface",
  className = "",
}: AvatarProps) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full",
        variantClasses[variant],
        className,
      )}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={imageAlt ?? name}
          width={40}
          height={40}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-label-sm font-bold">{getInitials(name)}</span>
      )}
    </div>
  );
}

export default Avatar;
