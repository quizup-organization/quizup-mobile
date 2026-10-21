import { useRouter } from "expo-router";
import { useState } from "react";

import {
  AppChip,
  AppText,
  Carousel,
  Grid,
  Screen,
  Section,
} from "@/components";
import { useTopicFacets } from "@/features/topics/hooks/use-topic-facets";
import { useTopics } from "@/features/topics/hooks/use-topics";
import { TopicCard } from "@/features/topics/components/topic-card";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";

interface CategoryOption {
  category: string | null;
  label: string;
}

export function TopicsPage() {
  const router = useRouter();
  const [category, setCategory] = useState<string | null>(null);

  const topics = useTopics({
    category: category ?? undefined,
    page: 0,
    size: 50,
  });
  const facets = useTopicFacets();

  const refetch = () => {
    void topics.refetch();
    void facets.refetch();
  };

  if (topics.isLoading || facets.isLoading) {
    return (
      <Screen tabBar>
        <LoadingState label="Chargement des sujets…" />
      </Screen>
    );
  }

  if (topics.isError || facets.isError) {
    return (
      <Screen tabBar>
        <ErrorState
          message="Impossible de charger les sujets."
          onRetry={refetch}
        />
      </Screen>
    );
  }

  const categories: CategoryOption[] = [
    { category: null, label: "Tous" },
    ...(facets.data?.categories ?? []).map((item) => ({
      category: item.category,
      label: item.label,
    })),
  ];
  const items = topics.data?.content ?? [];

  return (
    <Screen
      tabBar
      refreshing={topics.isRefetching || facets.isRefetching}
      onRefresh={refetch}
    >
      <Section>
        <Carousel
          items={categories}
          renderItem={(item) => (
            <AppChip
              label={item.label}
              selected={category === item.category}
              onPress={() => setCategory(item.category)}
            />
          )}
        />
      </Section>

      <AppText variant="caption" tone="muted">
        {`${topics.data?.totalElements ?? 0} sujets`}
      </AppText>

      {items.length === 0 ? (
        <EmptyState
          title="Aucun sujet dans cette catégorie"
          subtitle="Essaie une autre catégorie."
        />
      ) : (
        <Grid
          items={items}
          columns={2}
          gap={12}
          renderItem={(topic, width) => (
            <TopicCard
              topic={topic}
              width={width}
              onPress={() => router.push(`/topics/${topic.topicId}`)}
            />
          )}
        />
      )}
    </Screen>
  );
}
