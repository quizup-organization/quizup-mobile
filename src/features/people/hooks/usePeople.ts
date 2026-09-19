import { useQueries, useQuery } from "@tanstack/react-query";
import { getUserId } from "@/lib/auth";
import { queryKeys } from "@/lib/query-keys";
import { profilesService } from "@/lib/services/profiles";
import { userFollowsService } from "@/lib/services/user-follows";
import type { Person } from "../components/PersonCard";

export type PeopleDirection = "following" | "followers";

/**
 * Personnes (Abonnements = je suis / Abonnés = me suivent).
 * `user-follows` ne renvoie que des identifiants → on résout les noms via `profile`.
 */
export function usePeople(direction: PeopleDirection) {
  const userId = getUserId();

  const idsQuery = useQuery({
    queryKey:
      direction === "following"
        ? queryKeys.userFollows.following(userId ?? "")
        : queryKeys.userFollows.followers(userId ?? ""),
    queryFn: () =>
      direction === "following"
        ? userFollowsService.searchFollowing(userId as string, {
            number: 0,
            size: 200,
          })
        : userFollowsService.searchFollowers(userId as string, {
            number: 0,
            size: 200,
          }),
    enabled: !!userId,
    select: (page) =>
      page.content.map((r) =>
        direction === "following" ? r.followedId : r.followerId,
      ),
  });

  const ids = idsQuery.data ?? [];

  const profileQueries = useQueries({
    queries: ids.map((id) => ({
      queryKey: queryKeys.profiles.detail(id),
      queryFn: () => profilesService.getById(id),
      staleTime: 10 * 60 * 1000,
    })),
  });

  const people: Person[] = ids.map((id, index) => ({
    userId: id,
    displayName: profileQueries[index]?.data?.displayName ?? "Joueur",
  }));

  return {
    people,
    isLoading:
      idsQuery.isLoading || profileQueries.some((q) => q.isLoading),
    isError: idsQuery.isError,
    refetch: idsQuery.refetch,
  };
}
