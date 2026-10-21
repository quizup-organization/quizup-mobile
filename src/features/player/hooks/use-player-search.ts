import { useQuery } from "@tanstack/react-query";

import { profilesService } from "@/features/player/lib/profiles";
import { queryKeys } from "@/lib/query-keys";

const STALE_MS = 30 * 1000;

export function usePlayerSearch(query: string) {
  const normalized = query.trim();

  return useQuery({
    queryKey: queryKeys.search.players(normalized),
    queryFn: () => profilesService.search(normalized),
    enabled: normalized.length >= 2,
    staleTime: STALE_MS,
  });
}
