"use client";

import { use, useState } from "react";
import { useDestination } from "@/hooks/useDestination";
import { usePackageDetail } from "@/hooks/usePackageDetail";
import { useUpdatePackage } from "@/hooks/useUpdatePackage";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorState from "@/components/ErrorState/ErrorState";
import Button from "@/components/Button/Button";
import Surface from "@/components/Surface/Surface";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import FormField from "@/components/FormField/FormField";
import TextAreaField from "@/components/TextAreaField/TextAreaField";
import type { ItineraryDay } from "@/app/types/api";
import BackButton from "@/components/BackButton/BackButton";
import ItineraryEditor from "@/app/(admin)/components/ItineraryEditor/ItineraryEditor";
import { packageEditSchema } from "@/lib/validation/schemas";
import { getFieldErrors } from "@/lib/validation/getFieldErrors";
import { LIMITS } from "@/lib/validation/limits";
import { useToastStore } from "@/stores/useToastStore";

export default function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string; key: string }>;
}) {
  const { id: destSlug, key } = use(params);
  const { data: destination, isLoading: destLoading } = useDestination(destSlug);
  const { data: pkg, isLoading: pkgLoading, isError, error, refetch } = usePackageDetail(destSlug, key);
  const updatePackage = useUpdatePackage(destination?.id ?? 0, destSlug, key);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [days, setDays] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const addToast = useToastStore((s) => s.addToast);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Seed editable fields from the loaded package (once per id, render-time).
  const [seededId, setSeededId] = useState<number | null>(null);
  if (pkg && pkg.id !== seededId) {
    setSeededId(pkg.id);
    setTitle(pkg.title);
    setPrice(String(pkg.price));
    setDays(String(pkg.days));
    setExcerpt(pkg.excerpt);
    setItinerary(pkg.itinerary ?? []);
  }

  if (destLoading || pkgLoading)
    return <LoadingSpinner message="Loading package…" fullScreen={false} />;
  if (isError)
    return (
      <ErrorState message={error instanceof Error ? error.message : undefined} onRetry={refetch} />
    );
  if (!pkg)
    return (
      <div className="p-8">
        <p className="text-body-md text-text-muted">Package not found.</p>
      </div>
    );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fieldErrors = getFieldErrors(packageEditSchema, {
      title,
      price,
      days,
      excerpt,
      itinerary,
    });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      if (fieldErrors.itinerary) {
        addToast({ key: "update-package", type: "error", message: fieldErrors.itinerary });
      }
      return;
    }
    setConfirmSaveOpen(true);
  }

  function handleConfirmSave() {
    updatePackage.mutate(
      { title, price: Number(price), days: Number(days), excerpt, itinerary },
      {
        onSuccess: () => {
          setConfirmSaveOpen(false);
          addToast({ key: "update-package", type: "success", message: "Package saved successfully" });
        },
        onError: (err) => {
          addToast({ key: "update-package", type: "error", message: err instanceof Error ? err.message : "Failed to save" });
        },
      }
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      <BackButton className="mb-6" />

      <h1 className="text-display-sm text-text mb-2">{pkg.title}</h1>
      <p className="text-body-md text-text-muted mb-8">{destSlug} · {pkg.key}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Basic info */}
        <Surface>
          <h2 className="text-headline-sm text-text">Package Info</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="pkg-title"
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={LIMITS.titleMax}
              errorMessage={errors.title}
            />

            <FormField
              id="pkg-price"
              label="Price (₹)"
              type="number"
              min={LIMITS.priceMin}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              errorMessage={errors.price}
            />

            <FormField
              id="pkg-days"
              label="Days"
              type="number"
              min={LIMITS.daysMin}
              max={LIMITS.daysMax}
              value={days}
              onChange={(e) => setDays(e.target.value)}
              errorMessage={errors.days}
            />
          </div>

          <TextAreaField
            id="pkg-excerpt"
            label="Excerpt"
            rows={3}
            maxLength={LIMITS.excerptMax}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            errorMessage={errors.excerpt}
          />
        </Surface>

        <ItineraryEditor itinerary={itinerary} onChange={setItinerary} />

        <div className="flex items-center gap-4">
          <Button
            variant="primary"
            type="submit"
            loading={updatePackage.isPending}
            disabled={
              !(
                title !== pkg.title ||
                price !== String(pkg.price) ||
                days !== String(pkg.days) ||
                excerpt !== pkg.excerpt ||
                JSON.stringify(itinerary) !== JSON.stringify(pkg.itinerary ?? [])
              )
            }
          >
            Save Changes
          </Button>
        </div>
      </form>

      <ConfirmDialog
        isOpen={confirmSaveOpen}
        title="Save package changes?"
        message="This will update the package details and itinerary visible on the public site."
        confirmLabel="Yes, save"
        variant="warning"
        isPending={updatePackage.isPending}
        onConfirm={handleConfirmSave}
        onCancel={() => setConfirmSaveOpen(false)}
      />
    </div>
  );
}
