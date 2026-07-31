"use client";

import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";

export function useProfile(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.profile.me(),
    queryFn: () => usersApi.getProfile(),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}
