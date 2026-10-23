import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { isMockData } from "@/lib/config";
import type { Page } from "@/shared/types/api";
import { toPage } from "@/shared/utils/page";
import type {
  PeopleDirection,
  PeopleParams,
  PlayerCard,
  PlayerProfile,
} from "../domain/profile";
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
};

/** Joueurs via le BFF, ou base de démonstration locale. */
export const profilesService = isMockData
  ? mockProfilesService
  : apiProfilesService;
