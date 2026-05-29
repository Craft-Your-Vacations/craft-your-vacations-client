"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { documentsApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";
import type { DocumentType } from "@/app/types/api";

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, formData }: { type: DocumentType; formData: FormData }) =>
      documentsApi.uploadDocument(type, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.my() });
    },
  });
}
