import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Screen } from "@/components/screen";
import { SectionHeader } from "@/components/section-header";
import { TopicCarousel } from "@/components/topic-carousel";
import { Text } from "@/components/ui/text";
import { useFollowedTopicIds } from "@/features/topics/hooks/useTopics";
import { topicsService, toTopicView } from "@/lib/services/topics";
import { queryKeys } from "@/lib/query-keys";
import type { SearchRequest } from "@/shared/types/search";

const TRENDING: SearchRequest = {
  filters: [{ property: "status", operator: "EQUALS", value: "PUBLISHED" }],
  sorts: [{ property: "followersCounter", direction: "DESC" }],
  page: { number: 0, size: 12 },
};

export function HomeScreen() {
  const router = useRouter();
  const { data: followedIds = [] } = useFollowedTopicIds();

  const followedRequest: SearchRequest = {
    filters: [
      { property: "status", operator: "EQUALS", value: "PUBLISHED" },
      { property: "topicId", operator: "IN", values: followedIds },
    ],
    sorts: [{ property: "followersCounter", direction: "DESC" }],
    page: { number: 0, size: 12 },
  };

  const followedQuery = useQuery({
    queryKey: queryKeys.topics.search(followedRequest),
    queryFn: () => topicsService.search(followedRequest),
    enabled: followedIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const trendingQuery = useQuery({
    queryKey: queryKeys.topics.search(TRENDING),
    queryFn: () => topicsService.search(TRENDING),
    staleTime: 5 * 60 * 1000,
  });

  const open = (id: string) => router.push(`/(app)/topic/${id}`);

  return (
    <Screen>
      {followedIds.length > 0 && (
        <Screen className="mb-8 p-0" scroll={false}>
          <SectionHeader title="Tes sujets suivis" />
          <TopicCarousel
            topics={(followedQuery.data?.content ?? []).map(toTopicView)}
            onOpen={open}
          />
        </Screen>
      )}

      <Screen className="p-0" scroll={false}>
        <SectionHeader title="Les plus joués en ce moment" />
        <TopicCarousel
          topics={(trendingQuery.data?.content ?? []).map(toTopicView)}
          onOpen={open}
        />
      </Screen>

      {trendingQuery.isLoading && (
        <Text className="mt-4 text-sm text-muted-foreground">Chargement…</Text>
      )}
    </Screen>
  );
}
