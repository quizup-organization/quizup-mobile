import { useQuery } from "@tanstack/react-query";
import { homeService } from "@/lib/services/home";
import { queryKeys } from "@/lib/query-keys";

/** Accueil BFF : sujets suivis + sujets les plus joués sur 24 h. */
export function useHome() {
  return useQuery({
    queryKey: queryKeys.home(),
    queryFn: () => homeService.get(),
    staleTime: 60_000,
  });
}
