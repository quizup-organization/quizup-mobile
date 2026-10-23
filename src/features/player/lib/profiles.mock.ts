import type {
  Language,
  PeopleDirection,
  PeopleParams,
  PlayerCard,
  PlayerProfile,
  ProfileActivity,
  TopicStat,
} from "@/features/player/domain/profile";
import type {
  GameHistoryItem,
  HeadToHead,
  ProfileGamesParams,
} from "@/features/player/domain/history";
import type { Page } from "@/shared/types/api";
import { ApiError } from "@/shared/types/api";
import { toPage } from "@/shared/utils/page";
import {
  db,
  getProfile,
  peopleFor,
  playerCard,
  setFollowPlayer,
} from "@/mocks/db";
import { assertSuccess, isEmpty, mockDelay } from "@/mocks/scenario";

function sortPeople(
  people: PlayerCard[],
  sort: PeopleParams["sort"],
): PlayerCard[] {
  const copy = [...people];
  if (sort === "ELO") {
    return copy.sort((left, right) => right.rating - left.rating);
  }
  if (sort === "ALPHA") {
    return copy.sort((left, right) =>
      (left.pseudonym ?? "").localeCompare(right.pseudonym ?? ""),
    );
  }
  return copy;
}

/** Joueurs alimentés par la base de démonstration locale. */
export const profilesService = {
  async detail(userId: string): Promise<PlayerProfile> {
    await mockDelay();
    assertSuccess();
    const profile = getProfile(userId);
    if (!profile) {
      throw new ApiError("Joueur introuvable.", { statusCode: 404 });
    }
    return {
      ...profile,
      following: db.following.has(userId),
      progression: { ...profile.progression },
      stats: { ...profile.stats },
    };
  },

  async people(
    _userId: string,
    direction: PeopleDirection,
    params: PeopleParams = {},
  ): Promise<Page<PlayerCard>> {
    await mockDelay(260);
    assertSuccess();
    if (isEmpty()) return toPage([], params.page ?? 0, params.size ?? 20);

    let people = peopleFor(direction);
    if (params.q?.trim()) {
      const query = params.q.trim().toLowerCase();
      people = people.filter((person) =>
        (person.pseudonym ?? "").toLowerCase().includes(query),
      );
    }

    return toPage(
      sortPeople(people, params.sort),
      params.page ?? 0,
      params.size ?? 20,
    );
  },

  async search(query: string): Promise<Page<PlayerCard>> {
    await mockDelay(260);
    assertSuccess();
    if (isEmpty() || query.trim().length < 2) {
      return toPage([], 0, 20);
    }
    const normalized = query.trim().toLowerCase();
    const people = db.profiles
      .filter((profile) =>
        (profile.pseudonym ?? "").toLowerCase().includes(normalized),
      )
      .map((profile) => playerCard(profile));
    return toPage(people, 0, 20);
  },

  async follow(userId: string): Promise<void> {
    await mockDelay(180);
    assertSuccess();
    setFollowPlayer(userId, true);
  },

  async unfollow(userId: string): Promise<void> {
    await mockDelay(180);
    assertSuccess();
    setFollowPlayer(userId, false);
  },

  async updatePseudonym(userId: string, pseudonym: string): Promise<void> {
    await mockDelay(180);
    assertSuccess();
    if (userId === db.me.userId) db.me.pseudonym = pseudonym;
    const profile = getProfile(userId);
    if (profile) profile.pseudonym = pseudonym;
  },

  async updateBio(userId: string, bio: string | null): Promise<void> {
    await mockDelay(180);
    assertSuccess();
    if (userId === db.me.userId) db.me.bio = bio;
    const profile = getProfile(userId);
    if (profile) profile.bio = bio;
  },

  async updateCountry(userId: string, country: string | null): Promise<void> {
    await mockDelay(180);
    assertSuccess();
    if (userId === db.me.userId) db.me.country = country;
    const profile = getProfile(userId);
    if (profile) profile.country = country;
  },

  async updateLanguage(userId: string, language: Language): Promise<void> {
    await mockDelay(180);
    assertSuccess();
    if (userId === db.me.userId) db.me.language = language;
  },

  async updateAvatarOptions(
    userId: string,
    avatarOptions: string | null,
  ): Promise<void> {
    await mockDelay(180);
    assertSuccess();
    if (userId === db.me.userId) db.me.avatarOptions = avatarOptions;
    const profile = getProfile(userId);
    if (profile) profile.avatarOptions = avatarOptions;
  },

  async updateBanner(
    userId: string,
    bannerUrl: string | null,
  ): Promise<void> {
    await mockDelay(180);
    assertSuccess();
    if (userId === db.me.userId) db.me.bannerUrl = bannerUrl;
    const profile = getProfile(userId);
    if (profile) profile.bannerUrl = bannerUrl;
  },

  async games(
    userId: string,
    params: ProfileGamesParams = {},
  ): Promise<Page<GameHistoryItem>> {
    await mockDelay(240);
    assertSuccess();
    const opponents = db.profiles.slice(0, 4);
    const items: GameHistoryItem[] = opponents.map((profile, index) => ({
      gameId: `mock-game-${userId}-${index}`,
      topic: {
        topicId: db.topics[index]?.topicId ?? "sciences",
        names: db.topics[index]?.names ?? { fr: "Sciences" },
        category: db.topics[index]?.category ?? null,
        emoji: db.topics[index]?.emoji ?? null,
        color: db.topics[index]?.color ?? null,
        imageUrl: db.topics[index]?.imageUrl ?? null,
        titles: null,
      },
      opponent: {
        userId: profile.userId,
        pseudonym: profile.pseudonym,
        avatarOptions: profile.avatarOptions,
      },
      opponentType: "HUMAN",
      outcome: index % 3 === 0 ? "LOSS" : "WIN",
      myScore: 70 - index * 5,
      opponentScore: index % 3 === 0 ? 80 : 40 + index * 5,
      xp: 40 - index * 5,
      playedAt: new Date(Date.now() - index * 86_400_000).toISOString(),
    }));
    return toPage(items, params.page ?? 0, params.size ?? 20);
  },

  async headToHead(_userId: string, against: string): Promise<HeadToHead> {
    await mockDelay(160);
    assertSuccess();
    const profile = getProfile(against);
    const played = Math.min(10, profile?.stats.played ?? 0);
    const wins = Math.floor(played * 0.5);
    const losses = Math.floor(played * 0.3);
    return { played, wins, losses, draws: played - wins - losses };
  },

  async topicStats(_userId: string): Promise<TopicStat[]> {
    await mockDelay(200);
    assertSuccess();
    return Object.entries(db.progress).map(([topicId, progress]) => {
      const topic = db.topics.find((item) => item.topicId === topicId);
      return {
        topicId,
        names: topic?.names ?? null,
        emoji: topic?.emoji ?? null,
        color: topic?.color ?? null,
        imageUrl: topic?.imageUrl ?? null,
        games: progress.games,
        xp: progress.xp,
      };
    });
  },

  async activity(userId: string): Promise<ProfileActivity> {
    await mockDelay(200);
    assertSuccess();
    const profile = getProfile(userId);
    const stats = profile?.stats ?? db.me.stats;
    const days = Array.from({ length: 14 }, (_, index) => ({
      date: new Date(Date.now() - index * 86_400_000)
        .toISOString()
        .slice(0, 10),
      games: index % 4 === 0 ? 0 : 1 + (index % 3),
    }));
    return {
      userId,
      currentStreak: stats.currentWinStreak,
      longestStreak: stats.bestWinStreak,
      lastActiveDate: days[1]?.date ?? null,
      totalActiveDays: days.filter((day) => day.games > 0).length,
      days,
    };
  },
};
