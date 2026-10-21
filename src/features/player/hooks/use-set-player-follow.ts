import { useMutation, useQueryClient } from "@tanstack/react-query";

import { profilesService } from "@/features/player/lib/profiles";
import { queryKeys } from "@/lib/query-keys";

/** Suit / ne suit plus un joueur, puis rafraîchit les listes et le profil. */
export function useSetPlayerFollow(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (following: boolean) =>
      following
        ? profilesService.follow(userId)
        : profilesService.unfollow(userId),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.me() }),
      ]),
  });
}
