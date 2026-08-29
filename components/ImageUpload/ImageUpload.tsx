"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Upload } from "lucide-react";
import Button from "@/components/Button/Button";
import { FILES } from "@/lib/validation/limits";

interface ImageUploadProps {
  /** Current image URL, if the record already has one. */
  value?: string;
  alt?: string;
  label?: string;
  helperText?: string;
  /** The page owns the mutation; this just hands over a validated file. */
  onUpload: (file: File) => void;
  isUploading?: boolean;
  /** Server-side failure, surfaced by the page. */
  error?: string | null;
}

/**
 * Single-image picker with a preview of what is currently stored. Extension and
 * size are checked here so an obviously bad file never leaves the browser; the
 * server re-checks both regardless.
 */
export default function ImageUpload({
  value,
  alt = "",
  label = "Image",
  helperText,
  onUpload,
  isUploading = false,
  error,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState("");

  const accept = FILES.imageExtensions.join(",");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const ext = "." + (file.name.split(".").pop() ?? "").toLowerCase();
    if (!(FILES.imageExtensions as readonly string[]).includes(ext)) {
      setLocalError("Allowed types: JPG, PNG, WEBP.");
      return;
    }
    if (file.size > FILES.maxSizeBytes) {
      setLocalError(`Image must be under ${FILES.maxSizeLabel}.`);
      return;
    }

    setLocalError("");
    onUpload(file);
  }

  const message = localError || error;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-label-md text-text-muted">{label}</span>

      <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-2xl border border-outline bg-surface-high">
        {value ? (
          <Image
            src={value}
            alt={alt}
            fill
            sizes="448px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-text-subtle">
            <ImagePlus className="h-8 w-8" strokeWidth={1.5} />
            <span className="text-body-sm">No image yet</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => inputRef.current?.click()}
          loading={isUploading}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4" />
          {value ? "Replace image" : "Upload image"}
        </Button>
        {helperText && !message && (
          <span className="text-body-sm text-text-subtle">{helperText}</span>
        )}
      </div>

      {message && <p className="text-body-sm text-error">{message}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  );
}
