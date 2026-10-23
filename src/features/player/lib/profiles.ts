import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { isMockData } from "@/lib/config";
import type { Page } from "@/shared/types/api";
import { toPage } from "@/shared/utils/page";
import type {
  Language,
  PeopleDirection,
  PeopleParams,
  PlayerCard,
  PlayerProfile,
  ProfileActivity,
  TopicStat,
} from "../domain/profile";
import type {
  GameHistoryItem,
  HeadToHead,
  ProfileGamesParams,
} from "../domain/history";
import { profilesService as mockProfilesService } from "./profiles.mock";

const MAX_PAGE_SIZE = 100;

interface Suggestion {
  type: "TOPIC" | "PLAYER";
  id: string;
  label: string | null;
  subtitle: string | null;
  avatarOptions: string | null;
  suspended?: boolean;
}

function peoplePath(userId: string, direction: PeopleDirection): string {
  return direction === "following"
    ? ENDPOINTS.profiles.following(userId)
    : ENDPOINTS.profiles.followers(userId);
}

const apiProfilesService = {
  detail: (userId: string): Promise<PlayerProfile> =>
    api.get<PlayerProfile>(ENDPOINTS.profiles.detail(userId)),

  people: (
    userId: string,
    direction: PeopleDirection,
    params: PeopleParams = {},
  ): Promise<Page<PlayerCard>> =>
    api.get<Page<PlayerCard>>(peoplePath(userId, direction), {
      params: {
        q: params.q?.trim() || undefined,
        sort: params.sort ?? "RECENT",
        page: params.page ?? 0,
        size: Math.min(params.size ?? 20, MAX_PAGE_SIZE),
      },
    }),

  /**
   * Recherche unifiée : le BFF renvoie des suggestions typées. Les cartes joueur
   * n'exposent pas encore l'Elo dans ce contrat, d'où le statut provisoire.
   */
  search: async (query: string): Promise<Page<PlayerCard>> => {
    const normalized = query.trim();
    if (normalized.length < 2) return toPage([], 0, 20);

    const suggestions = await api.get<Suggestion[]>(ENDPOINTS.suggestions, {
      params: { q: normalized, limit: 20 },
    });
    const players = suggestions
      .filter((suggestion) => suggestion.type === "PLAYER")
      .map<PlayerCard>((suggestion) => ({
        userId: suggestion.id,
        pseudonym: suggestion.label,
        avatarOptions: suggestion.avatarOptions,
        rating: 0,
        provisional: true,
        following: false,
        presence: null,
        suspended: suggestion.suspended,
      }));

    return toPage(players, 0, 20);
  },

  follow: (userId: string): Promise<void> =>
    api.put<void>(ENDPOINTS.profiles.follow(userId)),

  unfollow: (userId: string): Promise<void> =>
    api.delete<void>(ENDPOINTS.profiles.follow(userId)),

  updatePseudonym: (userId: string, pseudonym: string): Promise<void> =>
    api.put<void>(ENDPOINTS.profiles.pseudonym(userId), { pseudonym }),

  updateBio: (userId: string, bio: string | null): Promise<void> =>
    api.put<void>(ENDPOINTS.profiles.bio(userId), { bio }),

  updateCountry: (userId: string, country: string | null): Promise<void> =>
    api.put<void>(ENDPOINTS.profiles.country(userId), { country }),

  updateLanguage: (userId: string, language: Language): Promise<void> =>
    api.put<void>(ENDPOINTS.profiles.language(userId), { language }),

  updateAvatarOptions: (
    userId: string,
    avatarOptions: string | null,
  ): Promise<void> =>
    api.put<void>(ENDPOINTS.profiles.avatarOptions(userId), {
      avatarOptions,
    }),

  updateBanner: (userId: string, bannerUrl: string | null): Promise<void> =>
    api.put<void>(ENDPOINTS.profiles.banner(userId), { bannerUrl }),

  games: (
    userId: string,
    params: ProfileGamesParams = {},
  ): Promise<Page<GameHistoryItem>> =>
    api.get<Page<GameHistoryItem>>(ENDPOINTS.profiles.games(userId), {
      params: {
        topicId: params.topicId,
        opponentId: params.opponentId,
        opponentType: params.opponentType,
        outcome:
          params.outcome && params.outcome !== "ALL"
            ? params.outcome
            : undefined,
        sort: params.sort,
        page: params.page ?? 0,
        size: Math.min(params.size ?? 20, MAX_PAGE_SIZE),
      },
    }),

  headToHead: (userId: string, against: string): Promise<HeadToHead> =>
    api.get<HeadToHead>(ENDPOINTS.profiles.headToHead(userId), {
      params: { against },
    }),

  topicStats: (userId: string): Promise<TopicStat[]> =>
    api.get<TopicStat[]>(ENDPOINTS.profiles.topics(userId)),

  activity: (
    userId: string,
    from?: string,
    to?: string,
  ): Promise<ProfileActivity> =>
    api.get<ProfileActivity>(ENDPOINTS.profiles.activity(userId), {
      params: { from, to },
    }),
};

/** Joueurs via le BFF, ou base de démonstration locale. */
export const profilesService = isMockData
  ? mockProfilesService
  : apiProfilesService;
