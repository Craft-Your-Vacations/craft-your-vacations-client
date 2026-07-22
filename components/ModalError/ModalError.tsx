"use client";

import { CircleX } from "lucide-react";
import Button from "@/components/Button/Button";
import Dialog from "@/components/Dialog/Dialog";

interface ModalErrorProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export default function ModalError({ isOpen, title, message, onClose }: ModalErrorProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} ariaLabel={title} className="items-center gap-4 text-center">
      <CircleX className="w-12 h-12 text-error" strokeWidth={1.5} />
      <div>
        <h2 className="text-headline-md text-text">{title}</h2>
        <p className="text-body-md text-text-muted mt-2">{message}</p>
      </div>
      <Button variant="primary" onClick={onClose} className="mt-2">
        Try Again
      </Button>
    </Dialog>
  );
}
