"use client";

import { useState, useEffect } from "react";
import { X, Star, ImagePlus } from "lucide-react";
import TextAreaField from "@/components/TextAreaField/TextAreaField";
import Button from "@/components/Button/Button";
import Dialog from "@/components/Dialog/Dialog";
import { reviewSchema } from "@/lib/validation/schemas";
import { getFieldErrors } from "@/lib/validation/getFieldErrors";
import { LIMITS, FILES } from "@/lib/validation/limits";

export interface ReviewSubmitData {
  rating: number;
  quote: string;
  files: File[];
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageTitle: string;
  isPending: boolean;
  error: Error | null;
  onSubmit: (data: ReviewSubmitData) => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  packageTitle,
  isPending,
  error,
  onSubmit,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [quote, setQuote] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileError, setFileError] = useState("");

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setRating(0);
        setHoverRating(0);
        setQuote("");
        setFiles([]);
        setErrors({});
        setFileError("");
      }, 200);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  function handleFiles(list: FileList | null) {
    const picked = Array.from(list ?? []);
    const allowed = FILES.reviewImageExtensions as readonly string[];
    const valid: File[] = [];
    let err = "";
    for (const f of picked) {
      const ext = "." + (f.name.split(".").pop() ?? "").toLowerCase();
      if (!allowed.includes(ext)) {
        err = "Only JPG, PNG or WEBP images are allowed.";
        continue;
      }
      if (f.size > FILES.maxSizeBytes) {
        err = `Each image must be under ${FILES.maxSizeLabel}.`;
        continue;
      }
      valid.push(f);
    }
    if (picked.length > FILES.reviewImagesMax) {
      err = `You can upload up to ${FILES.reviewImagesMax} photos.`;
    }
    setFiles(valid.slice(0, FILES.reviewImagesMax));
    setFileError(err);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fieldErrors = getFieldErrors(reviewSchema, { rating, quote });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    onSubmit({ rating, quote: quote.trim(), files });
  }

  const activeRating = hoverRating || rating;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} ariaLabel={`Review ${packageTitle}`} size="lg" className="gap-6">
      {/* Close button */}
      <Button
        variant="icon"
        size="sm"
        onClick={onClose}
        className="absolute top-5 right-5"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </Button>

      <div>
        <h2 className="text-headline-md text-text">Share your experience</h2>
        <p className="text-body-md text-text-muted mt-1">{packageTitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Star picker */}
        <div className="flex flex-col gap-2">
          <label className="text-label-sm text-text-muted uppercase tracking-widest">
            Your rating <span className="text-error">*</span>
          </label>
          <div className="flex gap-2" onMouseLeave={() => setHoverRating(0)}>
            {Array.from({ length: 5 }).map((_, i) => {
              const value = i + 1;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      value <= activeRating
                        ? "fill-primary text-primary"
                        : "text-text-subtle"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          {errors.rating && (
            <p className="text-body-sm text-error">{errors.rating}</p>
          )}
        </div>

        {/* Review text */}
        <TextAreaField
          id="review-quote"
          label="Your review"
          placeholder="Tell others about your experience — what made it special, what you loved, any highlights…"
          rows={4}
          maxLength={LIMITS.quoteMax}
          required
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          errorMessage={errors.quote}
        />

        {/* Image upload */}
        <div className="flex flex-col gap-2">
          <label className="text-label-sm text-text-muted uppercase tracking-widest">
            Trip photos <span className="text-text-subtle">(optional)</span>
          </label>
          <label
            htmlFor="review-images"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-dashed border-outline hover:border-primary/50 cursor-pointer transition-colors ghost-border"
          >
            <ImagePlus className="w-5 h-5 text-text-subtle shrink-0" />
            <span className="text-body-sm text-text-muted">
              {files.length > 0
                ? `${files.length} photo${files.length > 1 ? "s" : ""} selected`
                : "Add up to 5 photos from your trip"}
            </span>
          </label>
          <input
            id="review-images"
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp"
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {fileError && <p className="text-body-sm text-error">{fileError}</p>}
        </div>

        {error && (
          <p className="text-body-sm text-error">
            {error.message || "Something went wrong. Please try again."}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          loading={isPending}
          disabled={rating === 0 || !quote.trim()}
          className="w-full justify-center mt-2"
        >
          Share My Experience
        </Button>
      </form>
    </Dialog>
  );
}
