import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type {
  ProgressionResponse,
  ProfileResponse,
  TopicProgressResponse,
} from "@/shared/types/api";
import type { Profile, Progression, TopicProgress } from "@/shared/types/domain";
import type { PageResponse, SearchRequest } from "@/shared/types/search";

export function toProgression(dto: ProgressionResponse): Progression {
  return {
    userId: dto.userId,
    xpTotal: dto.xpTotal,
    level: dto.level,
    title: dto.title,
    xpForNextLevel: dto.xpForNextLevel,
    badges: dto.badges ?? [],
    topics: (dto.topics ?? []).map(toTopicProgress),
    duelStats: dto.duelStats,
  };
}

export function toTopicProgress(dto: TopicProgressResponse): TopicProgress {
  return {
    topicId: dto.topicId,
    xp: dto.xp,
    level: dto.level,
    title: dto.title,
  };
}

export function toProfile(dto: ProfileResponse): Profile {
  return {
    userId: dto.userId,
    email: dto.email,
    displayName: dto.displayName,
    bio: dto.bio,
    country: dto.country,
  };
}

export const profilesService = {
  getById: (userId: string): Promise<ProfileResponse> =>
    api.get<ProfileResponse>(ENDPOINTS.profiles.detail(userId)),

  getProgress: (userId: string): Promise<ProgressionResponse> =>
    api.get<ProgressionResponse>(ENDPOINTS.profiles.progress(userId)),

  getTopicProgress: (
    userId: string,
    topicId: string,
  ): Promise<TopicProgressResponse> =>
    api.get<TopicProgressResponse>(
      ENDPOINTS.profiles.topicProgress(userId, topicId),
    ),

  search: (body: SearchRequest): Promise<PageResponse<ProfileResponse>> =>
    api.post<PageResponse<ProfileResponse>>(ENDPOINTS.profiles.search, body),

  update: (
    userId: string,
    body: { displayName?: string; bio?: string; country?: string },
  ): Promise<void> => api.put<void>(ENDPOINTS.profiles.update(userId), body),
};
