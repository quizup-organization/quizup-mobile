import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type { TopicFollower } from "@/shared/types/domain";
import type { IdResponse, PageResponse, SearchRequest } from "@/shared/types/search";

export const topicFollowsService = {
  search: (body: SearchRequest): Promise<PageResponse<TopicFollower>> =>
    api.post<PageResponse<TopicFollower>>(ENDPOINTS.topicFollows.search, body),

  follow: (topicId: string): Promise<IdResponse> =>
    api.post<IdResponse>(ENDPOINTS.topicFollows.create, { topicId }),

  unfollow: (followId: string): Promise<IdResponse> =>
    api.delete<IdResponse>(ENDPOINTS.topicFollows.delete(followId)),
};
