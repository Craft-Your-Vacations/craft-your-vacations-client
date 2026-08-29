import { TriangleAlert } from "lucide-react";
import Button from "@/components/Button/Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 ${className}`}
    >
      <div className="glass ghost-border shadow-lg shadow-primary/20 rounded-3xl p-10 w-full max-w-sm flex flex-col items-center gap-6 text-center">
        {/* Icon */}
        <TriangleAlert className="w-10 h-10 text-error" strokeWidth={1.5} />

        {/* Text */}
        <div className="flex flex-col gap-2">
          <h3 className="text-headline-sm text-text">{title}</h3>
          {message && (
            <p className="text-body-sm text-text-muted">{message}</p>
          )}
        </div>

        {/* Action */}
        {onRetry && (
          <Button variant="primary" size="md" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    </div>
  );
}

export default ErrorState;
