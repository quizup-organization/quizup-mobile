import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type { IdResponse } from "@/shared/types/api";
import type { EventEnvelope, RoomNotification } from "@/shared/types/notifications";
import type { BotDifficulty, RoomView } from "@/shared/types/bff";

/** Salles d'attente : création, consultation, apparition, sortie, annulation, relance. */
export const roomsService = {
  create: (topicId: string): Promise<IdResponse> =>
    api.post<IdResponse>(ENDPOINTS.rooms.create, { topicId }),

  createBot: (
    topicId: string,
    difficulty: BotDifficulty = "NORMAL",
  ): Promise<IdResponse> =>
    api.post<IdResponse>(ENDPOINTS.rooms.bot, { topicId, difficulty }),

  mine: (): Promise<RoomView[]> => api.get<RoomView[]>(ENDPOINTS.rooms.mine),

  get: (roomId: string): Promise<RoomView> =>
    api.get<RoomView>(ENDPOINTS.rooms.detail(roomId)),

  join: (roomId: string): Promise<void> =>
    api.post<void>(ENDPOINTS.rooms.join(roomId)),

  leave: (roomId: string): Promise<void> =>
    api.post<void>(ENDPOINTS.rooms.leave(roomId)),

  cancel: (roomId: string): Promise<void> =>
    api.post<void>(ENDPOINTS.rooms.cancel(roomId)),

  wizz: (roomId: string): Promise<void> =>
    api.post<void>(ENDPOINTS.rooms.wizz(roomId)),

  notifications: (
    roomId: string,
  ): Promise<EventEnvelope<RoomNotification>[]> =>
    api.get<EventEnvelope<RoomNotification>[]>(
      ENDPOINTS.rooms.notifications(roomId),
    ),
};
