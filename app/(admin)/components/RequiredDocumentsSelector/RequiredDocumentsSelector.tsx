"use client";

import type { DocumentType } from "@/app/types/api";
import { DOCUMENT_OPTIONS } from "@/lib/constants";

interface RequiredDocumentsSelectorProps {
  value: DocumentType[];
  onChange: (docs: DocumentType[]) => void;
}

export default function RequiredDocumentsSelector({
  value,
  onChange,
}: RequiredDocumentsSelectorProps) {
  function toggle(type: DocumentType) {
    onChange(
      value.includes(type) ? value.filter((d) => d !== type) : [...value, type]
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-headline-sm text-text">Required Documents</h3>
        <p className="text-body-sm text-text-muted mt-0.5">
          Select which documents the customer must submit for this trip.
        </p>
      </div>
      <div className="flex flex-wrap gap-4">
        {DOCUMENT_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <input
              type="checkbox"
              checked={value.includes(opt.value)}
              onChange={() => toggle(opt.value)}
              className="w-4 h-4 accent-primary rounded"
            />
            <span className="text-body-sm text-text">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
