import { useRouter } from "expo-router";

import {
  AppCard,
  AppText,
  Carousel,
  Column,
  Row,
  Screen,
  Section,
  Spacer,
} from "@/components";
import { useActiveGames } from "@/features/game/hooks/use-active-games";
import { useHome } from "@/features/home/hooks/use-home";
import { useMe } from "@/features/profile/hooks/use-me";
import { TopicCard } from "@/features/topics/components/topic-card";
import { TopicEmoji } from "@/features/topics/components/topic-emoji";
import { topicName } from "@/features/topics/domain/topic";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";

export function HomePage() {
  const router = useRouter();
  const home = useHome();
  const me = useMe();
  const activeGames = useActiveGames();

  const refetch = () => {
    void home.refetch();
    void me.refetch();
    void activeGames.refetch();
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

      {activeGames.data && activeGames.data.length > 0 ? (
        <Section title="Reprendre">
          <Column spacing={8}>
            {activeGames.data.slice(0, 2).map((game) => {
              const name = topicName(
                game.topic.names,
                language,
                game.topic.topicId,
              );
              const opponent =
                game.opponent?.pseudonym ??
                (game.opponentType === "BOT" ? "Bot" : "Adversaire");
              return (
                <AppCard
                  key={game.gameId}
                  onPress={() => router.push(`/games/${game.gameId}`)}
                  accessibilityLabel={`Reprendre la partie ${name}`}
                >
                  <Row spacing={12} alignment="center">
                    <TopicEmoji
                      emoji={game.topic.emoji}
                      color={game.topic.color}
                      size={38}
                    />
                    <Column spacing={2}>
                      <AppText variant="label" numberOfLines={1}>
                        {name}
                      </AppText>
                      <AppText variant="caption" tone="muted">
                        {`Contre ${opponent}`}
                      </AppText>
                    </Column>
                    <Spacer flexible />
                    <AppText variant="caption" tone="accent">
                      Reprendre
                    </AppText>
                  </Row>
                </AppCard>
              );
            })}
          </Column>
        </Section>
      ) : null}

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
