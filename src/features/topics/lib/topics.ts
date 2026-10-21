import type {
  TopicCard,
  TopicCategory,
  TopicFacets,
  TopicFacetsParams,
  TopicLeaderboard,
  TopicLeaderboardParams,
  TopicListParams,
  TopicOverview,
} from "@/features/topics/domain/topic";
import type { Page } from "@/shared/types/api";
import { ApiError } from "@/shared/types/api";
import { toPage } from "@/shared/utils/page";
import { db, getTopic, leaderboardFor, setFollowTopic } from "@/mocks/db";
import { assertSuccess, isEmpty, mockDelay } from "@/mocks/scenario";

function filterTopics(params: TopicListParams): TopicCard[] {
  let topics = [...db.topics];
  if (params.q?.trim()) {
    const query = params.q.trim().toLowerCase();
    topics = topics.filter((topic) =>
      Object.values(topic.names).some((name) =>
        name?.toLowerCase().includes(query),
      ),
    );
  }
  if (params.category) {
    topics = topics.filter((topic) => topic.category === params.category);
  }
  if (params.followed) {
    topics = topics.filter((topic) => topic.followed);
  }

  switch (params.sort) {
    case "ALPHA":
      return topics.sort((left, right) =>
        (left.names.fr ?? "").localeCompare(right.names.fr ?? ""),
      );
    case "RECENT":
      return topics.reverse();
    case "MOST_PLAYED":
    case "POPULAR":
    default:
      return topics.sort(
        (left, right) => right.followersCount - left.followersCount,
      );
  }
}

/** Implémentation mock du service Sujets — remplacée par le BFF en phase API. */
export const topicsService = {
  async list(params: TopicListParams = {}): Promise<Page<TopicCard>> {
    await mockDelay();
    assertSuccess();
    if (isEmpty()) return toPage([], params.page ?? 0, params.size ?? 24);
    return toPage(
      filterTopics(params),
      params.page ?? 0,
      params.size ?? 24,
    );
  },

  async facets(params: TopicFacetsParams = {}): Promise<TopicFacets> {
    await mockDelay(220);
    assertSuccess();
    if (isEmpty()) return { total: 0, categories: [] };

    const topics = filterTopics({
      q: params.q,
      followed: params.followed,
      size: 100,
    });
    const counts = new Map<string, { label: string; count: number }>();
    for (const topic of topics) {
      if (!topic.category) continue;
      const current = counts.get(topic.category);
      counts.set(topic.category, {
        label: topic.categoryLabel ?? topic.category,
        count: (current?.count ?? 0) + 1,
      });
    }

    return {
      total: topics.length,
      categories: [...counts.entries()].map(([category, value]) => ({
        category,
        label: value.label,
        count: value.count,
      })),
    };
  },

  async categories(): Promise<TopicCategory[]> {
    await mockDelay(180);
    assertSuccess();
    if (isEmpty()) return [];

    const categories = new Map<string, string>();
    for (const topic of db.topics) {
      if (topic.category) {
        categories.set(topic.category, topic.categoryLabel ?? topic.category);
      }
    }
    return [...categories.entries()].map(([category, label]) => ({
      category,
      label,
    }));
  },

  async overview(topicId: string): Promise<TopicOverview> {
    await mockDelay();
    assertSuccess();
    const topic = getTopic(topicId);
    const progress = db.progress[topicId];
    if (!topic || !progress) {
      throw new ApiError("Sujet introuvable.", { statusCode: 404 });
    }

    const leaderboard = leaderboardFor(topicId);
    const me = leaderboard.find((entry) => entry.userId === db.me.userId);

    return {
      topic,
      titles: null,
      myRank: me?.rank ?? null,
      myProgress: progress,
      canManage: false,
    };
  },

  async leaderboard(
    topicId: string,
    params: TopicLeaderboardParams = {},
  ): Promise<TopicLeaderboard> {
    await mockDelay(260);
    assertSuccess();
    if (!getTopic(topicId)) {
      throw new ApiError("Sujet introuvable.", { statusCode: 404 });
    }
    const entries = isEmpty() ? [] : leaderboardFor(topicId);
    const me = entries.find((entry) => entry.userId === db.me.userId) ?? null;

    return {
      entries: toPage(entries, params.page ?? 0, params.size ?? 20),
      me,
    };
  },

  async follow(topicId: string): Promise<void> {
    await mockDelay(180);
    assertSuccess();
    setFollowTopic(topicId, true);
  },

  async unfollow(topicId: string): Promise<void> {
    await mockDelay(180);
    assertSuccess();
    setFollowTopic(topicId, false);
  },
};
