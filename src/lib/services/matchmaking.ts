import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type {
  EventEnvelope,
  MatchmakingNotification,
} from "@/shared/types/notifications";
import type { MatchmakingTicketView } from "@/shared/types/bff";

/** Appariement public : enqueue, statut, annulation et historique. */
export const matchmakingService = {
  enqueue: (topicId: string): Promise<MatchmakingTicketView> =>
    api.post<MatchmakingTicketView>(ENDPOINTS.matchmaking.tickets, {
      topicId,
    }),

  get: (ticketId: string): Promise<MatchmakingTicketView> =>
    api.get<MatchmakingTicketView>(ENDPOINTS.matchmaking.ticket(ticketId)),

  cancel: (ticketId: string): Promise<void> =>
    api.post<void>(ENDPOINTS.matchmaking.cancel(ticketId)),

  notifications: (
    ticketId: string,
  ): Promise<EventEnvelope<MatchmakingNotification>[]> =>
    api.get<EventEnvelope<MatchmakingNotification>[]>(
      ENDPOINTS.matchmaking.notifications(ticketId),
    ),
};
