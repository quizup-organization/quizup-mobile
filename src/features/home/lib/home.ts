import type { Home } from "@/features/home/domain/home";
import { db } from "@/mocks/db";
import { assertSuccess, isEmpty, mockDelay } from "@/mocks/scenario";

/** Implémentation mock du service Accueil — remplacée par le BFF en phase API. */
export const homeService = {
  async get(): Promise<Home> {
    await mockDelay();
    assertSuccess();

    if (isEmpty()) {
      return { followedTopics: [], trendingTopics: [], newTopics: [] };
    }

    const followedTopics = db.topics.filter((topic) => topic.followed).slice(0, 4);
    const trendingTopics = [...db.topics]
      .sort((left, right) => right.followersCount - left.followersCount)
      .slice(0, 4);
    const newTopics = [...db.topics].slice(-3).reverse();

    return { followedTopics, trendingTopics, newTopics };
  },
};
