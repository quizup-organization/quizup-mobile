import { useQuery } from "@tanstack/react-query";

import { progressionService } from "@/features/profile/lib/progression";
import { queryKeys } from "@/lib/query-keys";

export function useRewards() {
  return useQuery({
    queryKey: queryKeys.meRewards(),
    queryFn: () => progressionService.rewards(),
    staleTime: 30_000,
  });
}
