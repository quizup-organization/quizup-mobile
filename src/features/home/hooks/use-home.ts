import { useQuery } from "@tanstack/react-query";

import { homeService } from "@/features/home/lib/home";
import { queryKeys } from "@/lib/query-keys";

const STALE_MS = 5 * 60 * 1000;

export function useHome() {
  return useQuery({
    queryKey: queryKeys.home(),
    queryFn: () => homeService.get(),
    staleTime: STALE_MS,
  });
}
