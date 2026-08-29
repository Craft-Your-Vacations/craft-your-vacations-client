"use client";

import { CheckCircle2 } from "lucide-react";
import Button from "@/components/Button/Button";
import Dialog from "@/components/Dialog/Dialog";

interface ModalSuccessProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export default function ModalSuccess({ isOpen, title, message, onClose }: ModalSuccessProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} ariaLabel={title} className="items-center gap-5 text-center">
      <CheckCircle2 className="w-12 h-12 text-success" strokeWidth={1.5} />
      <div>
        <h2 className="text-headline-md text-text">{title}</h2>
        <p className="text-body-md text-text-muted mt-2">{message}</p>
      </div>
      <Button variant="primary" onClick={onClose} className="mt-2">
        Done
      </Button>
    </Dialog>
  );
}
