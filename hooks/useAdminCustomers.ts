"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";

export function useAdminCustomers(page = 1) {
  return useQuery({
    queryKey: queryKeys.admin.customers(page),
    queryFn: () => adminApi.getCustomers(page),
    staleTime: 1000 * 60,
  });
}
