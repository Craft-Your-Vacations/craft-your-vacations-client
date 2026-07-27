"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";

export function useAdminCustomers(page = 1, search = "") {
  return useQuery({
    queryKey: queryKeys.admin.customers(page, search),
    queryFn: () => adminApi.getCustomers(page, 20, search),
    staleTime: 1000 * 60,
  });
}
