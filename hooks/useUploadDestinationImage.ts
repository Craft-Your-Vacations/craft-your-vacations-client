"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";

export function useUploadDestinationImage(id: number, slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      adminApi.uploadDestinationImage(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.destinations.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.destinations.detail(slug),
      });
    },
  });
}
