import type {
  PeopleDirection,
  PeopleParams,
  PlayerCard,
  PlayerProfile,
} from "@/features/player/domain/profile";
import type { Page } from "@/shared/types/api";
import { ApiError } from "@/shared/types/api";
import { toPage } from "@/shared/utils/page";
import { db, getProfile, peopleFor, playerCard, setFollowPlayer } from "@/mocks/db";
import { assertSuccess, isEmpty, mockDelay } from "@/mocks/scenario";

function sortPeople(people: PlayerCard[], sort: PeopleParams["sort"]): PlayerCard[] {
  const copy = [...people];
  if (sort === "LEVEL") {
    return copy.sort((left, right) => right.level - left.level);
  }
  if (sort === "ALPHA") {
    return copy.sort((left, right) =>
      (left.pseudonym ?? "").localeCompare(right.pseudonym ?? ""),
    );
  }
  return copy;
}

/** Implémentation mock du service Joueurs — remplacée par le BFF en phase API. */
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
};
