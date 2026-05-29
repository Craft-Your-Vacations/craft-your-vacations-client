"use client";

import { useQuery } from "@tanstack/react-query";
import { documentsApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";

export function useUserDocuments() {
  return useQuery({
    queryKey: queryKeys.documents.my(),
    queryFn: documentsApi.getMyDocuments,
    staleTime: 1000 * 60,
  });
}
