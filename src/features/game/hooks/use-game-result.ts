import { useQuery } from "@tanstack/react-query";

import { gamesService } from "@/features/game/lib/games";
import { queryKeys } from "@/lib/query-keys";

/** Bilan autoritaire d'une partie ; rafraîchi tant que la récompense est en cours de projection. */
export function useGameResult(gameId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.games.result(gameId ?? ""),
    queryFn: () => gamesService.result(gameId ?? ""),
    enabled: Boolean(gameId),
    staleTime: 0,
    retry: 5,
    retryDelay: 800,
    refetchInterval: (query) =>
      query.state.data?.reward ? false : 2_000,
  });
}
