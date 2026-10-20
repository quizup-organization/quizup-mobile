import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type { EventEnvelope, GameNotification } from "@/shared/types/notifications";
import type {
  ActiveGameView,
  GameChoice,
  GameResultView,
} from "@/shared/types/bff";

/** Arène : réponse, abandon/annulation, résultat et historique de notifications. */
export const gamesService = {
  active: (): Promise<ActiveGameView[]> =>
    api.get<ActiveGameView[]>(ENDPOINTS.games.active),

  answer: (gameId: string, choice: GameChoice): Promise<void> =>
    api.post<void>(ENDPOINTS.games.answer(gameId), { choice }),

  abandon: (gameId: string): Promise<void> =>
    api.post<void>(ENDPOINTS.games.abandon(gameId)),

  cancel: (gameId: string): Promise<void> =>
    api.post<void>(ENDPOINTS.games.cancel(gameId)),

  result: (gameId: string): Promise<GameResultView> =>
    api.get<GameResultView>(ENDPOINTS.games.result(gameId)),

  notifications: (
    gameId: string,
  ): Promise<EventEnvelope<GameNotification>[]> =>
    api.get<EventEnvelope<GameNotification>[]>(
      ENDPOINTS.games.notifications(gameId),
    ),
};
