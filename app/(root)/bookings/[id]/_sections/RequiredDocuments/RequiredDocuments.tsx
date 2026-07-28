import { ShieldCheck } from "lucide-react";
import Surface from "@/components/Surface/Surface";
import DocumentUpload from "@/components/DocumentUpload/DocumentUpload";
import type { DocumentType, UserDocument } from "@/app/types/api";

interface RequiredDocumentsProps {
  isConfirmed: boolean;
  requiredDocuments: DocumentType[];
  documents: UserDocument[] | undefined;
  labels: Record<DocumentType, string>;
  onUpload: (type: DocumentType, file: File) => void;
  onView: (doc: UserDocument) => void;
  isUploading: boolean;
  uploadingType?: DocumentType;
}

export default function RequiredDocuments({
  isConfirmed,
  requiredDocuments,
  documents,
  labels,
  onUpload,
  onView,
  isUploading,
  uploadingType,
}: RequiredDocumentsProps) {
  if (!isConfirmed || requiredDocuments.length === 0) return null;

  const docMap = Object.fromEntries(
    (documents ?? []).map((d) => [d.type, d])
  ) as Partial<Record<DocumentType, UserDocument>>;

  return (
    <Surface className="gap-4">
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <h2 className="text-headline-sm text-text">Required Documents</h2>
          <p className="text-body-sm text-text-muted mt-1">
            Documents you upload are saved to your profile and reused for future
            trips.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {requiredDocuments.map((docType) => (
          <DocumentUpload
            key={docType}
            type={docType}
            label={labels[docType]}
            existingDocument={docMap[docType]}
            onUpload={onUpload}
            onView={onView}
            isUploading={isUploading && uploadingType === docType}
          />
        ))}
      </div>
    </Surface>
  );
}
