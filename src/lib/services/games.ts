import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type {
  BotDifficulty,
  QuestionResponse,
  ServerTimeResponse,
} from "@/shared/types/api";
import type { Game, GameChoice } from "@/shared/types/domain";
import type { IdResponse, PageResponse, SearchRequest } from "@/shared/types/search";

export const gamesService = {
  search: (body: SearchRequest): Promise<PageResponse<Game>> =>
    api.post<PageResponse<Game>>(ENDPOINTS.games.search, body),

  getById: (gameId: string): Promise<Game> =>
    api.get<Game>(ENDPOINTS.games.detail(gameId)),

  createBotGame: (body: {
    topicId: string;
    playerId: string;
    playerName: string;
    difficulty: BotDifficulty;
  }): Promise<IdResponse> => api.post<IdResponse>(ENDPOINTS.games.create, body),

  answer: (
    gameId: string,
    playerId: string,
    choice: GameChoice,
  ): Promise<IdResponse> =>
    api.post<IdResponse>(ENDPOINTS.games.answer(gameId), { playerId, choice }),

  cancel: (gameId: string): Promise<IdResponse> =>
    api.post<IdResponse>(ENDPOINTS.games.cancel(gameId)),

  serverTime: (): Promise<ServerTimeResponse> =>
    api.get<ServerTimeResponse>(ENDPOINTS.games.time),
};

export const questionsService = {
  getById: (questionId: string): Promise<QuestionResponse> =>
    api.get<QuestionResponse>(ENDPOINTS.questions.detail(questionId)),
};
