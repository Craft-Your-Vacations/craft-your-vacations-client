import Dialog from "@/components/Dialog/Dialog";
import Button from "@/components/Button/Button";
import { X } from "lucide-react";
import type { UserDocument } from "@/app/types/api";

interface DocumentViewerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  document: UserDocument | null;
  label: string;
}

export default function DocumentViewerDialog({
  isOpen,
  onClose,
  document,
  label,
}: DocumentViewerDialogProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} ariaLabel={label || "View document"} size="lg">
      {document && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-body-md font-semibold text-text">{label}</p>
            <Button variant="icon" size="sm" onClick={onClose} aria-label="Close">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-[70vh]">
            <iframe src={document.fileUrl} className="w-full h-full" title={label} />
          </div>
        </>
      )}
    </Dialog>
  );
}
