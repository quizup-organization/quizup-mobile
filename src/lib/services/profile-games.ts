import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type {
  GameHistoryItemView,
  Page,
  ProfileGamesParams,
} from "@/shared/types/bff";

/** Historique paginé des duels d'un joueur (`GET /api/profiles/{id}/games`). */
export const profileGamesService = {
  list: (
    userId: string,
    params: ProfileGamesParams = {},
  ): Promise<Page<GameHistoryItemView>> =>
    api.get<Page<GameHistoryItemView>>(ENDPOINTS.profiles.games(userId), {
      params: {
        topicId: params.topicId,
        opponentId: params.opponentId,
        opponentType: params.opponentType,
        outcome: params.outcome,
        sort: params.sort,
        page: params.page ?? 0,
        size: Math.min(params.size ?? 20, 100),
      },
    }),
};
