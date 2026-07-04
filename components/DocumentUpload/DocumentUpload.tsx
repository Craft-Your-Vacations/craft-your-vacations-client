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

  const formattedDate = existingDocument
    ? new Date(
        existingDocument.updatedAt ?? existingDocument.uploadedAt
      ).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="glass ghost-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-outline">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
            <FileCheck className="w-4 h-4 text-primary" />
          </div>
          <span className="text-body-sm font-semibold text-text">{label}</span>
        </div>
        {existingDocument ? (
          <span className="flex items-center gap-1.5 text-label-sm text-green-500 font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            Uploaded
          </span>
        ) : (
          <span className="text-label-sm text-text-subtle">Not uploaded</span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3">
        {existingDocument ? (
          <>
            {/* Document info row */}
            <div className="flex items-center gap-3 p-3 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-medium text-text">
                  Document on file
                </p>
                <p className="text-label-sm text-text-muted">
                  Updated {formattedDate}
                </p>
              </div>
              <Button
                variant="icon"
                size="sm"
                onClick={() => onView(existingDocument)}
                aria-label="View document"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>

            {/* Update action */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="w-full justify-center"
            >
              <Upload className="w-4 h-4" />
              {isUploading ? "Uploading…" : "Update document"}
            </Button>
          </>
        ) : (
          /* Upload zone */
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="flex flex-col items-center gap-3 py-8 rounded-xl border-2 border-dashed border-outline hover:border-primary/50 hover:bg-primary/5 transition-all group disabled:opacity-50 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-surface-high group-hover:bg-primary/10 transition-colors flex items-center justify-center">
              <Upload className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-body-sm text-text-muted group-hover:text-text transition-colors">
                {isUploading ? "Uploading…" : "Click to upload"}
              </p>
              <p className="text-label-sm text-text-subtle mt-0.5">
                PDF, JPG or PNG
              </p>
            </div>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  );
}
