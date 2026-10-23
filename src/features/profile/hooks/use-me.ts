import { useQuery } from "@tanstack/react-query";

import { meService } from "@/features/profile/lib/me";
import { queryKeys } from "@/lib/query-keys";

const STALE_MS = 2 * 60 * 1000;

export function useMe(enabled = true) {
  return useQuery({
    queryKey: queryKeys.me(),
    queryFn: () => meService.get(),
    enabled,
    staleTime: STALE_MS,
  });
}
