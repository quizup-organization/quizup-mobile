import { useQuery } from "@tanstack/react-query";

import type { ProfileGamesParams } from "@/features/player/domain/history";
import { profilesService } from "@/features/player/lib/profiles";
import { queryKeys } from "@/lib/query-keys";

export function useProfileGames(
  userId: string | undefined,
  params: ProfileGamesParams = {},
) {
  return useQuery({
    queryKey: queryKeys.profiles.games(userId ?? "", params),
    queryFn: () => profilesService.games(userId ?? "", params),
    enabled: Boolean(userId),
    staleTime: 60_000,
  });
}
