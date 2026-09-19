import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type { MatchmakingTicket } from "@/shared/types/domain";
import type { IdResponse } from "@/shared/types/search";

/**
 * File d'attente de matchmaking. Le ticket (= id de lobby) est lu jusqu'à `MATCHED`
 * pour récupérer le `gameId` de la partie créée par la saga serveur.
 */
export const matchmakingService = {
  enqueue: (topicId: string): Promise<IdResponse> =>
    api.post<IdResponse>(ENDPOINTS.matchmaking.queue, { topicId }),

  getTicket: (ticketId: string): Promise<MatchmakingTicket> =>
    api.get<MatchmakingTicket>(ENDPOINTS.matchmaking.ticket(ticketId)),

  cancel: (ticketId: string): Promise<IdResponse> =>
    api.delete<IdResponse>(ENDPOINTS.matchmaking.ticket(ticketId)),
};
