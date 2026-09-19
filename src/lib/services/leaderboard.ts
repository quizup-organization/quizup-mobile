import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type { TopicLeaderboardEntry } from "@/shared/types/domain";

export type LeaderboardPeriod = "all-time" | "monthly";
export type LeaderboardScope = "world" | "friends" | "country";

export const leaderboardService = {
  topByTopic: (
    topicId: string,
    period: LeaderboardPeriod = "all-time",
    scope: LeaderboardScope = "world",
    limit = 50,
  ): Promise<TopicLeaderboardEntry[]> =>
    api.get<TopicLeaderboardEntry[]>(
      ENDPOINTS.leaderboard.topic(topicId, period, scope, limit),
    ),

  myRank: (
    topicId: string,
    period: LeaderboardPeriod = "all-time",
    scope: LeaderboardScope = "world",
  ): Promise<TopicLeaderboardEntry | null> =>
    api.get<TopicLeaderboardEntry | null>(
      ENDPOINTS.leaderboard.me(topicId, period, scope),
    ),
};
