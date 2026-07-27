"use client";

import { useState } from "react";
import Surface from "@/components/Surface/Surface";
import { useDestinations } from "@/hooks/useDestinations";
import { useDeleteDestination } from "@/hooks/useDeleteDestination";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorState from "@/components/ErrorState/ErrorState";
import Button from "@/components/Button/Button";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminPageHeader from "@/app/(admin)/components/AdminPageHeader";
import { useToastStore } from "@/stores/useToastStore";

export default function AdminDestinationsPage() {
  const { data: destinations, isLoading, isError, error, refetch } = useDestinations();
  const deleteDestination = useDeleteDestination();
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const pendingDestTitle = destinations?.find((d) => d.id === confirmDeleteId)?.title ?? "";
  const addToast = useToastStore((s) => s.addToast);

  if (isLoading) return <LoadingSpinner message="Loading destinations…" fullScreen={false} />;
  if (isError)
    return (
      <ErrorState message={error instanceof Error ? error.message : undefined} onRetry={refetch} />
    );

  return (
    <div className="p-8">
      <AdminPageHeader
        title="Destinations"
        subtitle={`${destinations?.length ?? 0} destinations`}
        action={
          <Button variant="primary" size="sm" href="/admin/destinations/new">
            <Plus className="w-4 h-4" />
            New Destination
          </Button>
        }
      />

      <div className="flex flex-col gap-4">
        {destinations?.map((dest) => (
          <Surface key={dest.id} className="flex-row items-center gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-headline-sm text-text">{dest.title}</h2>
                {dest.isFeatured && (
                  <span className="px-2 py-0.5 rounded-full text-label-sm bg-primary/15 text-primary">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-body-sm text-text-muted">{dest.slug}</p>
              {dest.destinationCities?.length > 0 && (
                <p className="text-label-sm text-text-subtle mt-1">
                  {dest.destinationCities.join(" · ")}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                href={`/admin/destinations/${dest.slug}`}
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDeleteId(dest.id)}
                className="hover:text-error hover:bg-error/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </Button>
            </div>
          </Surface>
        ))}
      </div>

      <ConfirmDialog
        isOpen={confirmDeleteId !== null}
        title={`Delete "${pendingDestTitle}"?`}
        message="This will permanently delete the destination and all its packages. This cannot be undone."
        confirmLabel="Yes, delete"
        variant="danger"
        isPending={deleteDestination.isPending}
        onConfirm={() => {
          if (confirmDeleteId !== null)
            deleteDestination.mutate(confirmDeleteId, {
              onSuccess: () => {
                setConfirmDeleteId(null);
                addToast({ key: "delete-destination", type: "success", message: "Destination deleted" });
              },
              onError: (err) => {
                addToast({ key: "delete-destination", type: "error", message: err instanceof Error ? err.message : "Failed to delete destination" });
              },
            });
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
