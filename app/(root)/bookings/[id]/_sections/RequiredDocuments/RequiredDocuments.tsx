import Section from "@/components/Section/Sections";
import DocumentUpload from "@/components/DocumentUpload/DocumentUpload";
import { DOCUMENT_LABELS } from "@/lib/constants";
import type { DocumentType, UserDocument } from "@/app/types/api";

interface RequiredDocumentsProps {
  isConfirmed: boolean;
  requiredDocuments: DocumentType[];
  documents: UserDocument[] | undefined;
  onUpload: (type: DocumentType, file: File) => void;
  onView: (doc: UserDocument) => void;
  isUploading: boolean;
  uploadingType?: DocumentType;
}

export default function RequiredDocuments({
  isConfirmed,
  requiredDocuments,
  documents,
  onUpload,
  onView,
  isUploading,
  uploadingType,
}: RequiredDocumentsProps) {
  if (!isConfirmed || requiredDocuments.length === 0) return null;

  const docMap = Object.fromEntries(
    (documents ?? []).map((d) => [d.type, d])
  ) as Partial<Record<DocumentType, UserDocument>>;

  const outstanding = requiredDocuments.filter((type) => !docMap[type]).length;

  return (
    <Section id="documents" title="">
      <div className="mb-8">
        <h2 className="text-headline-lg text-text">Required documents</h2>
        <p className="text-body-md text-text-muted mt-1">
          {outstanding > 0
            ? `${outstanding} still to upload · saved to your profile and reused for future trips`
            : "All set — these are saved to your profile and reused for future trips"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {requiredDocuments.map((docType) => (
          <DocumentUpload
            key={docType}
            type={docType}
            label={DOCUMENT_LABELS[docType]}
            existingDocument={docMap[docType]}
            onUpload={onUpload}
            onView={onView}
            isUploading={isUploading && uploadingType === docType}
          />
        ))}
      </div>
    </Section>
  );
}
