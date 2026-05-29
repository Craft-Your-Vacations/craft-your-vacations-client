"use client";

import { useQuery } from "@tanstack/react-query";
import { bookingsApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";

export function useBooking(id: number) {
  return useQuery({
    queryKey: queryKeys.bookings.detail(id),
    queryFn: () => bookingsApi.getById(id),
    staleTime: 1000 * 30,
  });
}
