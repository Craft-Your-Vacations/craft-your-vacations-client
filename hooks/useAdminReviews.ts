"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";

export function useAdminReviews(page = 1, isApproved?: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.reviews(isApproved, page),
    queryFn: () => adminApi.getReviews(page, isApproved),
    staleTime: 1000 * 30,
  });
}
