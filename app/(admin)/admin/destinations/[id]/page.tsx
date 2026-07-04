"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useDestination } from "@/hooks/useDestination";
import { useUpdateDestination } from "@/hooks/useUpdateDestination";
import { useDeletePackage } from "@/hooks/useDeletePackage";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorState from "@/components/ErrorState/ErrorState";
import Button from "@/components/Button/Button";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import FormField from "@/components/FormField/FormField";
import TextAreaField from "@/components/TextAreaField/TextAreaField";
import { Plus, Trash2 } from "lucide-react";
import AdminBackLink from "@/app/(admin)/components/AdminBackLink";
import CityTagInput from "@/app/(admin)/components/CityTagInput";

export default function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: destSlug } = use(params);
  const slug = destSlug;
  const { data: destination, isLoading, isError, error, refetch } = useDestination(slug);

  const numericId = destination?.id ?? 0;
  const updateDestination = useUpdateDestination(numericId, slug);
  const deletePackage = useDeletePackage(numericId, slug);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null);

  useEffect(() => {
    if (destination) {
      setTitle(destination.title);
      setContent(destination.content);
      setImagePath(destination.imagePath);
      setIsFeatured(destination.isFeatured);
      setCities(destination.destinationCities ?? []);
    }
  }, [destination]);

  if (isLoading) return <LoadingSpinner message="Loading destination…" fullScreen={false} />;
  if (isError)
    return (
      <ErrorState message={error instanceof Error ? error.message : undefined} onRetry={refetch} />
    );
  if (!destination)
    return (
      <div className="p-8">
        <p className="text-body-md text-text-muted">Destination not found.</p>
      </div>
    );

  function handleSave(e: React.SubmitEvent) {
    e.preventDefault();
    setConfirmSaveOpen(true);
  }

  function handleConfirmSave() {
    updateDestination.mutate(
      { title, content, imagePath, isFeatured, destinationCities: cities },
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
      <AdminBackLink href="/admin/destinations" label="Back to destinations" />

      <h1 className="text-display-sm text-text mb-8">{destination.title}</h1>

      <form onSubmit={handleSave} className="flex flex-col gap-5 mb-10">
        <div className="glass rounded-2xl p-6 flex flex-col gap-5">
          <h2 className="text-headline-sm text-text">Destination Info</h2>

          <FormField
            id="dest-title"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <FormField
            id="dest-image"
            label="Image Path"
            value={imagePath}
            onChange={(e) => setImagePath(e.target.value)}
          />

          <TextAreaField
            id="dest-content"
            label="Content"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-label-md text-text-muted">Cities</label>
            <CityTagInput cities={cities} onChange={setCities} />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-body-sm text-text">Featured destination</span>
          </label>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="primary"
            type="submit"
            disabled={
              !(
                title !== destination.title ||
                content !== destination.content ||
                imagePath !== destination.imagePath ||
                isFeatured !== destination.isFeatured ||
                JSON.stringify(cities) !== JSON.stringify(destination.destinationCities ?? [])
              ) || updateDestination.isPending
            }
          >
            {updateDestination.isPending ? "Saving…" : "Save Changes"}
          </Button>
          {saveSuccess && <span className="text-body-sm text-success">Saved successfully</span>}
          {updateDestination.error && (
            <span className="text-body-sm text-error">
              {updateDestination.error instanceof Error
                ? updateDestination.error.message
                : "Failed to save"}
            </span>
          )}
        </div>
      </form>

      {/* Packages */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-outline flex items-center justify-between">
          <h2 className="text-headline-sm text-text">Packages</h2>
          <Button
            variant="secondary"
            size="sm"
            href={`/admin/destinations/${slug}/packages/new`}
          >
            <Plus className="w-4 h-4" />
            New Package
          </Button>
        </div>

        {destination.packages?.length === 0 && (
          <div className="px-6 py-8 text-center">
            <p className="text-body-md text-text-muted">No packages yet</p>
          </div>
        )}

        <div className="divide-y divide-outline">
          {destination.packages?.map((pkg) => (
            <div key={pkg.key} className="px-6 py-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-body-sm text-text font-medium">{pkg.title}</p>
                <p className="text-label-sm text-text-muted">
                  {pkg.days} days · ₹{pkg.price.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/destinations/${slug}/packages/${pkg.key}`}
                  className="px-3 py-1.5 rounded-xl text-body-sm text-text-muted bg-surface hover:bg-surface-high transition-colors"
                >
                  Edit
                </Link>

                <button
                  onClick={() => setConfirmDeleteKey(pkg.key)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmSaveOpen}
        title="Save destination changes?"
        message="This will update the destination info visible on the public site."
        confirmLabel="Yes, save"
        variant="warning"
        isPending={updateDestination.isPending}
        onConfirm={handleConfirmSave}
        onCancel={() => setConfirmSaveOpen(false)}
      />

      <ConfirmDialog
        isOpen={confirmDeleteKey !== null}
        title={`Delete package "${destination.packages?.find((p) => p.key === confirmDeleteKey)?.title ?? confirmDeleteKey}"?`}
        message="This package and its full itinerary will be permanently deleted."
        confirmLabel="Yes, delete"
        variant="danger"
        isPending={deletePackage.isPending}
        onConfirm={() => {
          if (confirmDeleteKey)
            deletePackage.mutate(confirmDeleteKey, { onSuccess: () => setConfirmDeleteKey(null) });
        }}
        onCancel={() => setConfirmDeleteKey(null)}
      />
    </div>
  );
}
