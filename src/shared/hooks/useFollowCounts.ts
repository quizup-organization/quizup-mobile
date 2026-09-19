import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { userFollowsService } from "@/lib/services/user-follows";

export interface FollowCounts {
  following: number;
  followers: number;
}

/**
 * Compteurs d'abonnements d'un joueur, calculés côté client à partir de deux `search`
 * (`totalElements`), sans endpoint de comptage dédié.
 */
export function useFollowCounts(userId: string) {
  return useQuery({
    queryKey: queryKeys.userFollows.counts(userId),
    queryFn: async (): Promise<FollowCounts> => {
      const [following, followers] = await Promise.all([
        userFollowsService.searchFollowing(userId, { number: 0, size: 1 }),
        userFollowsService.searchFollowers(userId, { number: 0, size: 1 }),
      ]);
      return {
        following: following.totalElements,
        followers: followers.totalElements,
      };
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}
