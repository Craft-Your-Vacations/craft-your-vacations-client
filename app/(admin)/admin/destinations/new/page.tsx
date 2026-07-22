"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateDestination } from "@/hooks/useCreateDestination";
import Button from "@/components/Button/Button";
import FormField from "@/components/FormField/FormField";
import TextAreaField from "@/components/TextAreaField/TextAreaField";
import AdminBackLink from "@/app/(admin)/components/AdminBackLink";
import CityTagInput from "@/app/(admin)/components/CityTagInput";
import { useToastStore } from "@/stores/useToastStore";

export default function NewDestinationPage() {
  const router = useRouter();
  const createDestination = useCreateDestination();
  const addToast = useToastStore((s) => s.addToast);

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [content, setContent] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [cities, setCities] = useState<string[]>([]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createDestination.mutate(
      { slug, title, imagePath, content, isFeatured, destinationCities: cities },
      {
        onSuccess: () => {
          addToast({ key: "create-destination", type: "success", message: "Destination created" });
          router.push("/admin/destinations");
        },
        onError: (err) => {
          addToast({ key: "create-destination", type: "error", message: err instanceof Error ? err.message : "Failed to create destination" });
        },
      }
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <AdminBackLink href="/admin/destinations" label="Back to destinations" />

      <h1 className="text-display-sm text-text mb-8">New Destination</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="glass rounded-2xl p-6 flex flex-col gap-5">
          <FormField
            id="dest-title"
            label="Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Maldives"
          />

          <FormField
            id="dest-slug"
            label="Slug"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
            placeholder="e.g. maldives"
          />

          <FormField
            id="dest-image"
            label="Image Path"
            required
            value={imagePath}
            onChange={(e) => setImagePath(e.target.value)}
            placeholder="e.g. /images/maldives.jpg"
          />

          <TextAreaField
            id="dest-content"
            label="Content"
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe this destination…"
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
          <Button variant="primary" type="submit" loading={createDestination.isPending}>
            Create Destination
          </Button>
        </div>
      </form>
    </div>
  );
}
