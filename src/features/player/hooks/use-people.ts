import { useQuery } from "@tanstack/react-query";

import type {
  PeopleDirection,
  PeopleParams,
} from "@/features/player/domain/profile";
import { profilesService } from "@/features/player/lib/profiles";
import { queryKeys } from "@/lib/query-keys";

const STALE_MS = 60 * 1000;
const DEFAULT_PARAMS: PeopleParams = { page: 0, size: 30 };

export function usePeople(
  userId: string | undefined,
  direction: PeopleDirection,
  params: PeopleParams = DEFAULT_PARAMS,
) {
  return useQuery({
    queryKey: queryKeys.profiles.people(
      userId ?? "",
      direction,
      params,
    ),
    queryFn: () => profilesService.people(userId ?? "", direction, params),
    enabled: Boolean(userId),
    staleTime: STALE_MS,
  });
}
