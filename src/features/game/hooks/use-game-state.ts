import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { foldGame } from "@/features/game/domain/game-fold";
import { gamesService } from "@/features/game/lib/games";
import { queryKeys } from "@/lib/query-keys";

const POLL_MS = 500;

/** Reconstruit l'état d'une partie en rejouant son historique REST. */
export function useGameState(gameId: string | undefined) {
  const query = useQuery({
    queryKey: queryKeys.games.notifications(gameId ?? ""),
    queryFn: () => gamesService.notifications(gameId ?? ""),
    enabled: Boolean(gameId),
    staleTime: 0,
    retry: 5,
    retryDelay: 500,
    refetchInterval: (current) => {
      const data = current.state.data;
      if (!data) return POLL_MS;
      const state = foldGame(gameId ?? "", data);
      return state.status === "IN_PROGRESS" ? POLL_MS : false;
    },
  });

  const game = useMemo(
    () => foldGame(gameId ?? "", query.data ?? []),
    [gameId, query.data],
  );

  return {
    ...query,
    game,
  };
}
