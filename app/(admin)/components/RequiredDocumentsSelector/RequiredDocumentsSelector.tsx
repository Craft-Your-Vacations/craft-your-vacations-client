"use client";

import type { DocumentType } from "@/app/types/api";
import { DOCUMENT_OPTIONS } from "@/lib/constants";
import Checkbox from "@/components/Checkbox/Checkbox";

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
          <Checkbox
            key={opt.value}
            checked={value.includes(opt.value)}
            onChange={() => toggle(opt.value)}
            label={opt.label}
          />
        ))}
      </div>
    </div>
  );
}
