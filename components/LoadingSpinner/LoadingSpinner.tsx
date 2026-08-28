import Image from "next/image";
import Logo from "@/public/logo.png";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  message,
  className = "",
  fullScreen = true,
}: LoadingSpinnerProps) {
  const heightClass = fullScreen ? "min-h-screen" : "min-h-[calc(100vh-4rem)]";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-6 ${heightClass} ${className}`}
    >
      <div className="relative flex items-center justify-center" aria-hidden="true">
        {/* Ring 1 */}
        <div
          className="absolute w-16 h-16 rounded-full bg-primary-app/30"
          style={{ animation: "loader-ping 2s ease-out infinite" }}
        />
        {/* Ring 2 — staggered */}
        <div
          className="absolute w-16 h-16 rounded-full bg-primary-app/20"
          style={{ animation: "loader-ping 2s ease-out infinite 0.7s" }}
        />
        {/* Core orb */}
        <div
          className="relative w-16 h-16 rounded-full bg-primary-app/15 border border-primary-app/30 flex items-center justify-center"
          style={{ animation: "loader-breathe 2.4s ease-in-out infinite" }}
        >
          <Image src={Logo} alt="" className="w-8 h-8 object-contain" />
        </div>
      </div>

      <p className="text-body-sm text-text-subtle tracking-wide">
        {message ?? "Crafting your experience…"}
      </p>
    </div>
  );
}

export default LoadingSpinner;
