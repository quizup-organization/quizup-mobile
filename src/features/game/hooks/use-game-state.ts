import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  foldGame,
  mergeGameEnvelope,
} from "@/features/game/domain/game-fold";
import type { GameNotification } from "@/features/game/domain/game-notification";
import { gamesService } from "@/features/game/lib/games";
import { queryKeys } from "@/lib/query-keys";
import { useStompSubscription } from "@/shared/hooks/use-stomp-subscription";
import type { EventEnvelope } from "@/shared/types/api";

const POLL_MS = 1_000;

/** Reconstruit l'état d'une partie en rejouant REST + push STOMP. */
export function useGameState(gameId: string | undefined) {
  const queryClient = useQueryClient();
  const key = queryKeys.games.notifications(gameId ?? "");

  const query = useQuery({
    queryKey: key,
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

  useStompSubscription(
    "game",
    gameId ? `/topic/games/${gameId}` : null,
    (message) => {
      let envelope: EventEnvelope<GameNotification>;
      try {
        envelope = JSON.parse(message.body) as EventEnvelope<GameNotification>;
      } catch {
        return;
      }
      if (
        !envelope ||
        typeof envelope.sequenceNumber !== "number" ||
        !envelope.payload?.type
      ) {
        return;
      }

      queryClient.setQueryData<EventEnvelope<GameNotification>[]>(
        key,
        (current) => mergeGameEnvelope(current ?? [], envelope),
      );
    },
    () => {
      void queryClient.invalidateQueries({ queryKey: key });
    },
  );

  const game = useMemo(
    () => foldGame(gameId ?? "", query.data ?? []),
    [gameId, query.data],
  );

  return {
    ...query,
    game,
  };
}
