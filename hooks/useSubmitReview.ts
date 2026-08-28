"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";
import type { CreateReviewRequest } from "@/app/types/api";

interface SubmitReviewInput extends CreateReviewRequest {
  files: File[];
}

export function useSubmitReview(destinationSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    // Create + image upload run as one mutation so `isPending` covers the whole
    // flow (loader stays up through the upload) and invalidation only fires once
    // the images are actually stored — otherwise refetches pull the imageless
    // review and cache it.
    mutationFn: async ({ files, ...body }: SubmitReviewInput) => {
      const review = await reviewsApi.create(body);
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((f) => formData.append("files", f));
        try {
          await reviewsApi.uploadImages(review.id, formData);
        } catch {
          // Non-fatal: the review is saved even if the image upload fails.
        }
      }
      return review;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.my() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byDestination(destinationSlug),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.approved() });
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    },
  });
}
