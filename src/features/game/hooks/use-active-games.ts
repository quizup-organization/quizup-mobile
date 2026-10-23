import { useQuery } from "@tanstack/react-query";

import { gamesService } from "@/features/game/lib/games";
import { queryKeys } from "@/lib/query-keys";
import { isMockData } from "@/lib/config";

/** Parties en cours du joueur, pour proposer une reprise. */
export function useActiveGames() {
  return useQuery({
    queryKey: queryKeys.games.active(),
    queryFn: () => gamesService.active(),
    enabled: !isMockData,
    staleTime: 15_000,
    refetchInterval: 30_000,
    retry: 1,
  });
}
