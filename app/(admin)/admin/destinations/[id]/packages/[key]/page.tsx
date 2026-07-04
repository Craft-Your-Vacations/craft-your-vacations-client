"use client";

import { use, useEffect, useState } from "react";
import { useDestination } from "@/hooks/useDestination";
import { usePackageDetail } from "@/hooks/usePackageDetail";
import { useUpdatePackage } from "@/hooks/useUpdatePackage";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorState from "@/components/ErrorState/ErrorState";
import Button from "@/components/Button/Button";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import FormField from "@/components/FormField/FormField";
import TextAreaField from "@/components/TextAreaField/TextAreaField";
import type { ItineraryDay } from "@/app/types/api";
import AdminBackLink from "@/app/(admin)/components/AdminBackLink";
import ItineraryEditor from "@/app/(admin)/components/ItineraryEditor/ItineraryEditor";

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
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);

  useEffect(() => {
    if (pkg) {
      setTitle(pkg.title);
      setPrice(String(pkg.price));
      setDays(String(pkg.days));
      setExcerpt(pkg.excerpt);
      setItinerary(pkg.itinerary ?? []);
    }
  }, [pkg]);

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
    setConfirmSaveOpen(true);
  }

  function handleConfirmSave() {
    updatePackage.mutate(
      { title, price: Number(price), days: Number(days), excerpt, itinerary },
      {
        onSuccess: () => {
          setConfirmSaveOpen(false);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        },
      }
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      <AdminBackLink
        href={`/admin/destinations/${destSlug}`}
        label={`Back to ${destination?.title ?? "destination"}`}
      />

      <h1 className="text-display-sm text-text mb-2">{pkg.title}</h1>
      <p className="text-body-md text-text-muted mb-8">{destSlug} · {pkg.key}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Basic info */}
        <div className="glass rounded-2xl p-6 flex flex-col gap-5">
          <h2 className="text-headline-sm text-text">Package Info</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              id="pkg-title"
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <FormField
              id="pkg-price"
              label="Price (₹)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <FormField
              id="pkg-days"
              label="Days"
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
            />
          </div>

          <TextAreaField
            id="pkg-excerpt"
            label="Excerpt"
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </div>

        <ItineraryEditor itinerary={itinerary} onChange={setItinerary} />

        <div className="flex items-center gap-4">
          <Button
            variant="primary"
            type="submit"
            disabled={
              !(
                title !== pkg.title ||
                price !== String(pkg.price) ||
                days !== String(pkg.days) ||
                excerpt !== pkg.excerpt ||
                JSON.stringify(itinerary) !== JSON.stringify(pkg.itinerary ?? [])
              ) || updatePackage.isPending
            }
          >
            Save Changes
          </Button>
          {saveSuccess && <span className="text-body-sm text-success">Saved successfully</span>}
          {updatePackage.error && (
            <span className="text-body-sm text-error">
              {updatePackage.error instanceof Error
                ? updatePackage.error.message
                : "Failed to save"}
            </span>
          )}
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
