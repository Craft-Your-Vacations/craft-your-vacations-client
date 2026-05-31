"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";

export function useAdminCustomerBookings(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.customerBookings(id),
    queryFn: () => adminApi.getCustomerBookings(id),
    staleTime: 1000 * 30,
  });
}
