"use client";

import { Clock } from "lucide-react";
import Button from "@/components/Button/Button";
import Dialog from "@/components/Dialog/Dialog";
import { useSignOut } from "@/hooks/useSignOut";

interface InactivityDialogProps {
  isOpen: boolean;
  countdown: number;
  onKeepSignedIn: () => void;
}

export default function InactivityDialog({
  isOpen,
  countdown,
  onKeepSignedIn,
}: InactivityDialogProps) {
  const signOut = useSignOut();
  // No onClose — backdrop click and Escape are intentionally disabled
  return (
    <Dialog isOpen={isOpen} ariaLabel="Session timeout warning" className="items-center gap-5 text-center">
      {/* Icon with countdown badge */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-primary/15" />
        <Clock className="w-7 h-7 text-primary" strokeWidth={1.5} />
        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[11px] font-bold text-white">
          {countdown}
        </span>
      </div>

      <div>
        <h2 className="text-headline-md text-text">Still there?</h2>
        <p className="text-body-md text-text-muted mt-2">
          You've been inactive for a while. You'll be signed out in{" "}
          <span className="text-primary font-semibold">
            {countdown} second{countdown !== 1 ? "s" : ""}
          </span>{" "}
          unless you'd like to continue.
        </p>
      </div>

      <div className="flex gap-3 w-full">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => signOut()}
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
