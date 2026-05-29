"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";

export function useAdminBookingDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.booking(id),
    queryFn: () => adminApi.getBooking(id),
    staleTime: 1000 * 30,
  });
}
