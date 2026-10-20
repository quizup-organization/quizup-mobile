import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { gamesService } from "@/lib/services/games";

/** Bilan autoritaire d'un duel terminé ; polling tant que la récompense n'est pas projetée. */
export function useGameResult(gameId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.games.result(gameId),
    queryFn: () => gamesService.result(gameId),
    enabled: !!gameId && enabled,
    staleTime: 30_000,
    retry: false,
    refetchInterval: (query) =>
      query.state.data?.reward == null ? 800 : false,
  });
}
