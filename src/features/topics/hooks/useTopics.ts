import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { topicsService } from "@/lib/services/topics";
import type {
  TopicFacetsParams,
  TopicListParams,
} from "@/shared/types/bff";

/** Taille de page du catalogue (alignée sur le web). */
export const TOPICS_PAGE_SIZE = 24;

const LIST_STALE_MS = 5 * 60 * 1000;

/**
 * Catalogue paginé (scroll infini) : recherche, catégorie, tri et filtre « suivis » appliqués
 * **côté BFF**. La clé de requête inclut les filtres : un changement repart de la page 0.
 */
export function useTopicsList(
  params: Omit<TopicListParams, "page" | "size">,
) {
  return useInfiniteQuery({
    queryKey: queryKeys.topics.list(params),
    queryFn: ({ pageParam }) =>
      topicsService.list({
        ...params,
        page: pageParam,
        size: TOPICS_PAGE_SIZE,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.page + 1,
    staleTime: LIST_STALE_MS,
    placeholderData: keepPreviousData,
  });
}

/** Facettes du catalogue (total + compteurs par catégorie) pour les filtres courants. */
export function useTopicFacets(params: TopicFacetsParams) {
  return useQuery({
    queryKey: queryKeys.topics.facets(params),
    queryFn: () => topicsService.facets(params),
    staleTime: LIST_STALE_MS,
    placeholderData: (previous) => previous,
  });
}
