"use client";

import { Clock } from "lucide-react";
import Button from "@/components/Button/Button";
import Dialog from "@/components/Dialog/Dialog";

interface InactivityDialogProps {
  isOpen: boolean;
  countdown: number;
  onKeepSignedIn: () => void;
  onSignOut: () => void;
}

export default function InactivityDialog({
  isOpen,
  countdown,
  onKeepSignedIn,
  onSignOut,
}: InactivityDialogProps) {
  // No onClose — backdrop click and Escape are intentionally disabled
  return (
    <Dialog isOpen={isOpen} ariaLabel="Session timeout warning" className="items-center gap-5 text-center">
      {/* Icon with countdown badge */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-primary/15" />
        <Clock className="w-7 h-7 text-primary" strokeWidth={1.5} />
        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-label-sm text-white">
          {countdown}
        </span>
      </div>

      <div>
        <h2 className="text-headline-md text-text">Still there?</h2>
        <p className="text-body-md text-text-muted mt-2">
          You&rsquo;ve been inactive for a while. You&rsquo;ll be signed out in{" "}
          <span className="text-primary font-semibold">
            {countdown} second{countdown !== 1 ? "s" : ""}
          </span>{" "}
          unless you&rsquo;d like to continue.
        </p>
      </div>

      <div className="flex gap-3 w-full">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={onSignOut}
        >
          Sign Out
        </Button>
        <Button variant="primary" className="flex-1" onClick={onKeepSignedIn}>
          Keep Signed In
        </Button>
      </div>
    </Dialog>
  );
}
