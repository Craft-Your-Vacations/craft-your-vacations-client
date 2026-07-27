"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateDestination } from "@/hooks/useCreateDestination";
import Button from "@/components/Button/Button";
import Surface from "@/components/Surface/Surface";
import Checkbox from "@/components/Checkbox/Checkbox";
import FormField from "@/components/FormField/FormField";
import TextAreaField from "@/components/TextAreaField/TextAreaField";
import BackButton from "@/components/BackButton/BackButton";
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
      <BackButton className="mb-6" />

      <h1 className="text-display-sm text-text mb-8">New Destination</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Surface>
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

          <Checkbox
            checked={isFeatured}
            onChange={setIsFeatured}
            label="Featured destination"
          />
        </Surface>

        <div className="flex items-center gap-4">
          <Button variant="primary" type="submit" loading={createDestination.isPending}>
            Create Destination
          </Button>
        </div>
      </form>
    </div>
  );
}
