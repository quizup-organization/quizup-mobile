import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type { TopicResponse } from "@/shared/types/api";
import type { Topic, TopicCategory } from "@/shared/types/domain";
import type { PageResponse, SearchRequest } from "@/shared/types/search";

export function toTopicView(dto: TopicResponse): Topic {
  return {
    id: dto.topicId,
    name: dto.name,
    emoji: dto.emoji,
    category: dto.category,
    color: dto.color,
    followers: dto.followersCounter ?? 0,
    description: dto.description,
  };
}

export const topicsService = {
  search: (body: SearchRequest): Promise<PageResponse<TopicResponse>> =>
    api.post<PageResponse<TopicResponse>>(ENDPOINTS.topics.search, body),

  getById: (topicId: string): Promise<TopicResponse> =>
    api.get<TopicResponse>(ENDPOINTS.topics.detail(topicId)),

  categories: (): Promise<TopicCategory[]> =>
    api.get<TopicCategory[]>(ENDPOINTS.topics.categories),
};
