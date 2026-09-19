import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type { UserFollower } from "@/shared/types/domain";
import type {
  IdResponse,
  PageCriteria,
  PageResponse,
  SearchRequest,
} from "@/shared/types/search";

/**
 * Aucun endpoint de lecture dédié : abonnements / abonnés / compteurs passent par
 * `POST /search` (filtres `followerId` / `followedId`). Le calcul est côté client.
 */
export const userFollowsService = {
  search: (body: SearchRequest): Promise<PageResponse<UserFollower>> =>
    api.post<PageResponse<UserFollower>>(ENDPOINTS.userFollows.search, body),

  follow: (followedId: string): Promise<IdResponse> =>
    api.post<IdResponse>(ENDPOINTS.userFollows.create, { followedId }),

  unfollow: (followId: string): Promise<IdResponse> =>
    api.delete<IdResponse>(ENDPOINTS.userFollows.delete(followId)),

  /** Joueurs suivis par `followerId` (mes abonnements). */
  searchFollowing: (
    followerId: string,
    page: PageCriteria = { number: 0, size: 50 },
  ): Promise<PageResponse<UserFollower>> =>
    api.post<PageResponse<UserFollower>>(ENDPOINTS.userFollows.search, {
      filters: [
        { property: "followerId", operator: "EQUALS", value: followerId },
      ],
      sorts: [{ property: "followedAt", direction: "DESC" }],
      page,
    }),

  /** Joueurs qui suivent `followedId` (ses abonnés). */
  searchFollowers: (
    followedId: string,
    page: PageCriteria = { number: 0, size: 50 },
  ): Promise<PageResponse<UserFollower>> =>
    api.post<PageResponse<UserFollower>>(ENDPOINTS.userFollows.search, {
      filters: [
        { property: "followedId", operator: "EQUALS", value: followedId },
      ],
      sorts: [{ property: "followedAt", direction: "DESC" }],
      page,
    }),
};
