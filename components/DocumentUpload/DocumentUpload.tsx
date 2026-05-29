"use client";

import { useRef } from "react";
import { Upload, FileCheck, CheckCircle, Eye } from "lucide-react";
import Button from "@/components/Button/Button";
import type { DocumentType, UserDocument } from "@/app/types/api";

interface DocumentUploadProps {
  type: DocumentType;
  label: string;
  existingDocument?: UserDocument;
  onUpload: (type: DocumentType, file: File) => void;
  onView: (doc: UserDocument) => void;
  isUploading: boolean;
}

export default function DocumentUpload({
  type,
  label,
  existingDocument,
  onUpload,
  onView,
  isUploading,
}: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(type, file);
      e.target.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl border border-outline bg-surface-high">
      <div className="flex items-center gap-2">
        <FileCheck className="w-4 h-4 text-primary/70 shrink-0" />
        <span className="text-body-sm text-text font-medium">{label}</span>
      </div>

      {existingDocument ? (
        <Button
          variant="secondary"
          onClick={() => onView(existingDocument)}
          className="w-full justify-between px-3 py-2.5"
          size="sm"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
            <div className="text-left">
              <p className="text-label-sm font-medium">Document uploaded</p>
              <p className="text-label-sm text-text-muted font-normal">
                {new Date(
                  existingDocument.updatedAt ?? existingDocument.uploadedAt
                ).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <Eye className="w-4 h-4 text-text-muted shrink-0" />
        </Button>
      ) : (
        <p className="text-label-sm text-text-muted">Not yet uploaded</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      <Button
        variant="secondary"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="w-full justify-center"
      >
        <Upload className="w-4 h-4 mr-2" />
        {isUploading ? "Uploading…" : existingDocument ? "Update Document" : "Upload"}
      </Button>
    </div>
  );
}
