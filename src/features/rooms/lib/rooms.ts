import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type { IdResponse } from "@/shared/types/api";
import type { RoomView } from "../domain/room";

/** Salles : création d'un duel bot, consultation et apparition. */
export const roomsService = {
  createBot: (
    topicId: string,
    difficulty: "EASY" | "NORMAL" | "HARD" = "NORMAL",
  ): Promise<IdResponse> =>
    api.post<IdResponse>(ENDPOINTS.rooms.bot, { topicId, difficulty }),

  get: (roomId: string): Promise<RoomView> =>
    api.get<RoomView>(ENDPOINTS.rooms.detail(roomId)),

  join: (roomId: string): Promise<void> =>
    api.post<void>(ENDPOINTS.rooms.join(roomId)),

  leave: (roomId: string): Promise<void> =>
    api.post<void>(ENDPOINTS.rooms.leave(roomId)),

  cancel: (roomId: string): Promise<void> =>
    api.post<void>(ENDPOINTS.rooms.cancel(roomId)),
};
