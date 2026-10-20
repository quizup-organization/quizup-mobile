import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { gamesService } from "@/lib/services/games";

/** Parties en cours du joueur (bandeau de reprise) — sonde tant qu'une partie existe. */
export function useActiveGames() {
  return useQuery({
    queryKey: queryKeys.games.active(),
    queryFn: () => gamesService.active(),
    staleTime: 15_000,
    refetchInterval: (query) =>
      (query.state.data?.length ?? 0) > 0 ? 15_000 : false,
    retry: false,
  });
}
