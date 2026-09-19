import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserId } from "@/lib/auth";
import { queryKeys } from "@/lib/query-keys";
import { profilesService } from "@/lib/services/profiles";
import { userFollowsService } from "@/lib/services/user-follows";
import { emptyPage, pageOf } from "@/shared/utils/page";
import { useFollowCounts } from "@/shared/hooks/useFollowCounts";

/** Profil public + progression + compteurs de suivi d'un joueur. */
export function usePlayer(playerId: string) {
  const profile = useQuery({
    queryKey: queryKeys.profiles.detail(playerId),
    queryFn: () => profilesService.getById(playerId),
    enabled: !!playerId,
    staleTime: 10 * 60 * 1000,
  });

  const progression = useQuery({
    queryKey: queryKeys.profiles.progress(playerId),
    queryFn: () => profilesService.getProgress(playerId),
    enabled: !!playerId,
    staleTime: 5 * 60 * 1000,
  });

  const counts = useFollowCounts(playerId);

  return {
    profile: profile.data,
    progression: progression.data,
    counts: counts.data,
    isLoading: profile.isLoading,
    isError: profile.isError,
  };
}

/** État de suivi du joueur ciblé par l'utilisateur courant (record + followId). */
export function useFollowState(playerId: string) {
  const userId = getUserId();
  return useQuery({
    queryKey: ["user-follow", userId, playerId],
    queryFn: () =>
      userFollowsService.search({
        filters: [
          ...(userId
            ? [{ property: "followerId", operator: "EQUALS", value: userId } as const]
            : []),
          { property: "followedId", operator: "EQUALS", value: playerId },
        ],
        page: { number: 0, size: 1 },
      }),
    enabled: !!userId && !!playerId,
    select: (page) => page.content[0] ?? null,
    staleTime: 5 * 60 * 1000,
  });
}

export function useToggleUserFollow(playerId: string) {
  const queryClient = useQueryClient();
  const userId = getUserId();
  const followKey = ["user-follow", userId, playerId];

  const follow = useMutation({
    mutationFn: () => userFollowsService.follow(playerId),
    onSuccess: (data) => {
      // Mise à jour optimiste : la projection user-follows est en lecture différée.
      queryClient.setQueryData(
        followKey,
        pageOf({
          followId: data.id,
          followerId: userId,
          followedId: playerId,
          followedAt: new Date().toISOString(),
        }),
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.userFollows.counts(playerId) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.userFollows.following(userId ?? ""),
      });
    },
  });

  const unfollow = useMutation({
    mutationFn: (followId: string) => userFollowsService.unfollow(followId),
    onSuccess: () => {
      queryClient.setQueryData(followKey, emptyPage());
      queryClient.invalidateQueries({ queryKey: queryKeys.userFollows.counts(playerId) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.userFollows.following(userId ?? ""),
      });
    },
  });

  return { follow, unfollow };
}
