import { useQuery } from "@tanstack/react-query";

import { progressionService } from "@/features/profile/lib/progression";
import { queryKeys } from "@/lib/query-keys";

export function usePlayerTitles(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.profiles.titles(userId ?? ""),
    queryFn: () => progressionService.titles(userId ?? ""),
    enabled: Boolean(userId),
    staleTime: 60_000,
  });
}
