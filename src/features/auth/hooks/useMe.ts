import { useQuery } from "@tanstack/react-query";
import { meService } from "@/lib/services/me";
import { queryKeys } from "@/lib/query-keys";

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me(),
    queryFn: () => meService.get(),
    staleTime: 30_000,
  });
}
