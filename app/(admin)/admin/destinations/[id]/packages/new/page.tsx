"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useDestination } from "@/hooks/useDestination";
import { useCreatePackage } from "@/hooks/useCreatePackage";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import Button from "@/components/Button/Button";
import FormField from "@/components/FormField/FormField";
import TextAreaField from "@/components/TextAreaField/TextAreaField";
import type { ItineraryDay } from "@/app/types/api";
import AdminBackLink from "@/app/(admin)/components/AdminBackLink";
import ItineraryEditor from "@/app/(admin)/components/ItineraryEditor/ItineraryEditor";
import { useToastStore } from "@/stores/useToastStore";

function emptyDay(dayNumber: number): ItineraryDay {
  return { dayNumber, title: "", activities: [{ time: "", description: "", type: "leisure" }] };
}

export default function NewPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: destSlug } = use(params);
  const router = useRouter();
  const { data: destination, isLoading } = useDestination(destSlug);
  const createPackage = useCreatePackage(destination?.id ?? 0, destSlug);
  const addToast = useToastStore((s) => s.addToast);

  const [key, setKey] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [days, setDays] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([emptyDay(1)]);

  if (isLoading) return <LoadingSpinner message="Loading…" fullScreen={false} />;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createPackage.mutate(
      { key, title, price: Number(price), days: Number(days), excerpt, itinerary },
      {
        onSuccess: () => {
          addToast({ key: "create-package", type: "success", message: "Package created" });
          router.push(`/admin/destinations/${destSlug}`);
        },
        onError: (err) => {
          addToast({ key: "create-package", type: "error", message: err instanceof Error ? err.message : "Failed to create package" });
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

      <h1 className="text-display-sm text-text mb-8">New Package</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Basic info */}
        <div className="glass rounded-2xl p-6 flex flex-col gap-5">
          <h2 className="text-headline-sm text-text">Package Info</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              id="pkg-title"
              label="Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 7 Days Luxury"
            />

            <FormField
              id="pkg-key"
              label="Key (URL slug)"
              required
              value={key}
              onChange={(e) => setKey(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              placeholder="e.g. luxury-7d"
            />

            <FormField
              id="pkg-price"
              label="Price (₹)"
              required
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 75000"
            />

            <FormField
              id="pkg-days"
              label="Days"
              required
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="e.g. 7"
            />
          </div>

          <TextAreaField
            id="pkg-excerpt"
            label="Excerpt"
            required
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Short description of this package…"
          />
        </div>

        <ItineraryEditor itinerary={itinerary} onChange={setItinerary} />

        <div className="flex items-center gap-4">
          <Button variant="primary" type="submit" loading={createPackage.isPending}>
            Create Package
          </Button>
        </div>
      </form>
    </div>
  );
}
