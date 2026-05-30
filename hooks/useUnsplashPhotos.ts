import { useQuery } from "@tanstack/react-query";
import { unsplashApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";

export function useUnsplashPhotos(query: string) {
  return useQuery({
    queryKey: queryKeys.unsplash.photos(query),
    queryFn: () => unsplashApi.getPhotos(query),
    enabled: Boolean(query),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours — matches server cache
  });
}
