import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { gamesService } from "@/lib/services/games";
import { foldGameEnvelopes } from "../domain/game";

/**
 * État d'une partie reconstruit par fold des notifications REST.
 *
 * <p>M2 utilise un polling court (~900 ms) ; M5 remplacera la source par STOMP sans changer
 * le fold ni les écrans.</p>
 */
export function useGameState(gameId: string) {
  const query = useQuery({
    queryKey: queryKeys.games.notifications(gameId),
    queryFn: () => gamesService.notifications(gameId),
    enabled: !!gameId,
    staleTime: 0,
    refetchInterval: (current) => {
      const envelopes = current.state.data;
      const terminal = envelopes?.some(
        (envelope) =>
          envelope.payload.type === "GAME_ENDED" ||
          envelope.payload.type === "GAME_CANCELLED",
      );
      return terminal ? false : 900;
    },
    retry: (failureCount, error) => {
      const status = (error as { statusCode?: number }).statusCode;
      return status === 404 ? failureCount < 12 : failureCount < 2;
    },
    retryDelay: 500,
  });

  const game = useMemo(
    () => foldGameEnvelopes(gameId, query.data ?? []),
    [gameId, query.data],
  );

  return {
    game,
    isLoading: query.isPending,
    isError: query.isError && !query.data,
    refresh: () => {
      void query.refetch();
    },
  };
}
