import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type { MatchmakingTicket } from "../domain/matchmaking";

/** Appariement public : entrée en recherche, lecture et annulation. */
export const matchmakingService = {
  enqueue: (topicId: string): Promise<MatchmakingTicket> =>
    api.post<MatchmakingTicket>(ENDPOINTS.matchmaking.tickets, { topicId }),

  get: (ticketId: string): Promise<MatchmakingTicket> =>
    api.get<MatchmakingTicket>(ENDPOINTS.matchmaking.ticket(ticketId)),

  cancel: (ticketId: string): Promise<void> =>
    api.post<void>(ENDPOINTS.matchmaking.cancel(ticketId)),
};
