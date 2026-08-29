import { cn } from "@/lib/utils";

interface ProgressDotsProps {
  /** Ordered step keys. */
  steps: readonly string[];
  /** The currently active step key. */
  current: string;
  className?: string;
}

// Step indicator: filled dots + connectors up to (and including) the current step.
// Shared by the multi-step auth flows (reset-password, onboarding).
export function ProgressDots({ steps, current, className = "" }: ProgressDotsProps) {
  const currentIndex = steps.indexOf(current);
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-3">
          <div
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-colors duration-300",
              i <= currentIndex ? "bg-primary-app" : "bg-surface-highest",
            )}
          />
          {i < steps.length - 1 && (
            <div
              className={cn(
                "w-8 h-px transition-colors duration-300",
                i < currentIndex ? "bg-primary-app" : "bg-surface-highest",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default ProgressDots;
