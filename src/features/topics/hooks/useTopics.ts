import { useQueries, useQuery } from "@tanstack/react-query";
import { getUserId } from "@/lib/auth";
import { queryKeys } from "@/lib/query-keys";
import { topicFollowsService } from "@/lib/services/topic-follows";
import { topicsService } from "@/lib/services/topics";
import { normalize } from "@/lib/helpers";
import type {
  FilterCriteria,
  PageCriteria,
  SearchRequest,
  SortCriteria,
} from "@/shared/types/search";
import { SORT_DIRECTION, type TopicSort } from "../stores/useTopicFilterStore";

export interface TopicSearchParams {
  query: string;
  categories: string[];
  sort: TopicSort;
  followedOnly: boolean;
  followedIds: string[];
  page: number;
  size: number;
}

export function buildTopicSearchRequest(
  params: TopicSearchParams,
): SearchRequest | null {
  if (params.followedOnly && params.followedIds.length === 0) {
    return null;
  }

  const filters: FilterCriteria[] = [
    { property: "status", operator: "EQUALS", value: "PUBLISHED" },
  ];

  if (params.query.trim()) {
    filters.push({
      property: "nameNormalized",
      operator: "CONTAINS",
      value: normalize(params.query),
    });
  }

  if (params.categories.length > 0) {
    filters.push({
      property: "category",
      operator: "IN",
      values: params.categories,
    });
  }

  if (params.followedOnly) {
    filters.push({
      property: "topicId",
      operator: "IN",
      values: params.followedIds,
    });
  }

  const sort = SORT_DIRECTION[params.sort];
  const sorts: SortCriteria[] = [
    { property: sort.property, direction: sort.direction },
  ];
  const page: PageCriteria = { number: params.page, size: params.size };

  return { filters, sorts, page };
}

export function useTopicSearch(params: TopicSearchParams) {
  const request = buildTopicSearchRequest(params);

  return useQuery({
    queryKey: queryKeys.topics.search(
      request ?? { filters: [], page: { number: 0, size: params.size } },
    ),
    queryFn: () =>
      request
        ? topicsService.search(request)
        : Promise.resolve({
            content: [],
            pageNumber: 0,
            pageSize: params.size,
            totalElements: 0,
            totalPages: 0,
            sorts: [],
            first: true,
            last: true,
            empty: true,
          }),
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useTopicCategories() {
  return useQuery({
    queryKey: queryKeys.topics.categories(),
    queryFn: () => topicsService.categories(),
    staleTime: 60 * 60 * 1000,
  });
}

/**
 * Compteurs par catégorie calculés côté client : une recherche `size=1` par catégorie,
 * dont on lit `totalElements` (pas d'endpoint de facettes dédié).
 */
export function useTopicFacetCounts(categories: string[]): Record<string, number> {
  const queries = useQueries({
    queries: categories.map((category) => {
      const request: SearchRequest = {
        filters: [
          { property: "status", operator: "EQUALS", value: "PUBLISHED" },
          { property: "category", operator: "EQUALS", value: category },
        ],
        page: { number: 0, size: 1 },
      };
      return {
        queryKey: queryKeys.topics.search(request),
        queryFn: () => topicsService.search(request),
        staleTime: 5 * 60 * 1000,
      };
    }),
  });

  const counts: Record<string, number> = {};
  categories.forEach((category, index) => {
    counts[category] = queries[index]?.data?.totalElements ?? 0;
  });
  return counts;
}

export function useFollowedTopicIds() {
  const userId = getUserId();
  return useQuery({
    queryKey: queryKeys.topicFollows.search({ filters: [], page: { number: 0, size: 200 } }),
    queryFn: () =>
      topicFollowsService.search({
        page: { number: 0, size: 200 },
      }),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    select: (page) => page.content.map((f) => f.topicId),
  });
}
