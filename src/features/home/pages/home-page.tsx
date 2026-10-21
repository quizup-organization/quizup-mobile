import { useRouter } from "expo-router";

import {
  Carousel,
  Column,
  Screen,
  Section,
  AppText,
} from "@/components";
import { useHome } from "@/features/home/hooks/use-home";
import { useMe } from "@/features/profile/hooks/use-me";
import { TopicCard } from "@/features/topics/components/topic-card";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";

export function HomePage() {
  const router = useRouter();
  const home = useHome();
  const me = useMe();

  const refetch = () => {
    void home.refetch();
    void me.refetch();
  };

  if (home.isLoading || me.isLoading) {
    return (
      <Screen tabBar>
        <LoadingState label="Chargement de ton accueil…" />
      </Screen>
    );
  }

  if (home.isError || me.isError) {
    return (
      <Screen tabBar>
        <ErrorState
          message="Impossible de charger l'accueil."
          onRetry={refetch}
        />
      </Screen>
    );
  }

  const data = home.data;
  const language = me.data?.language ?? "fr";
  const pseudonym = me.data?.pseudonym;
  const empty =
    !data ||
    (data.followedTopics.length === 0 &&
      data.trendingTopics.length === 0 &&
      data.newTopics.length === 0);

  const openTopic = (topicId: string) => router.push(`/topics/${topicId}`);

  return (
    <Screen
      tabBar
      refreshing={home.isRefetching || me.isRefetching}
      onRefresh={refetch}
    >
      <Column spacing={4}>
        <AppText variant="title">
          {pseudonym ? `Bonjour ${pseudonym}` : "Bonjour"}
        </AppText>
        <AppText variant="body" tone="muted">
          Prêt pour ta session du jour ?
        </AppText>
      </Column>

      {empty || !data ? (
        <EmptyState
          title="Aucun sujet pour le moment"
          subtitle="Reviens plus tard ou explore le catalogue."
        />
      ) : (
        <>
          {data.followedTopics.length > 0 ? (
            <Section
              title="Tes sujets"
              action={`${data.followedTopics.length}`}
            >
              <Carousel
                items={data.followedTopics}
                itemWidth={176}
                renderItem={(topic, width) => (
                  <TopicCard
                    topic={topic}
                    width={width}
                    language={language}
                    onPress={() => openTopic(topic.topicId)}
                  />
                )}
              />
            </Section>
          ) : null}

          {data.trendingTopics.length > 0 ? (
            <Section title="Tendances" action="Cette semaine">
              <Carousel
                items={data.trendingTopics}
                itemWidth={176}
                renderItem={(topic, width) => (
                  <TopicCard
                    topic={topic}
                    width={width}
                    language={language}
                    onPress={() => openTopic(topic.topicId)}
                  />
                )}
              />
            </Section>
          ) : null}

          {data.newTopics.length > 0 ? (
            <Section title="Nouveaux" action="À découvrir">
              <Carousel
                items={data.newTopics}
                itemWidth={176}
                renderItem={(topic, width) => (
                  <TopicCard
                    topic={topic}
                    width={width}
                    language={language}
                    onPress={() => openTopic(topic.topicId)}
                  />
                )}
              />
            </Section>
          ) : null}
        </>
      )}
    </Screen>
  );
}
