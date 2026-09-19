import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type { Challenge } from "@/shared/types/domain";
import type { IdResponse, PageResponse, SearchRequest } from "@/shared/types/search";

export const challengesService = {
  search: (body: SearchRequest): Promise<PageResponse<Challenge>> =>
    api.post<PageResponse<Challenge>>(ENDPOINTS.challenges.search, body),

  create: (challengedId: string, topicId: string): Promise<IdResponse> =>
    api.post<IdResponse>(ENDPOINTS.challenges.create, { challengedId, topicId }),

  getById: (challengeId: string): Promise<Challenge> =>
    api.get<Challenge>(ENDPOINTS.challenges.detail(challengeId)),

  accept: (challengeId: string): Promise<IdResponse> =>
    api.post<IdResponse>(ENDPOINTS.challenges.accept(challengeId)),

  decline: (challengeId: string): Promise<IdResponse> =>
    api.post<IdResponse>(ENDPOINTS.challenges.decline(challengeId)),
};
