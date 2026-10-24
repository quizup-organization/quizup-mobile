import { useRouter } from "expo-router";

import {
  AppButton,
  AppCard,
  AppImage,
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
import { useContentWidth } from "@/hooks/use-content-width";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { formatNumber } from "@/shared/utils/format";

export function HomePage() {
  const router = useRouter();
  const width = useContentWidth();
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
  const profile = me.data;
  const language = profile?.language ?? "fr";
  const pseudonym = profile?.pseudonym;
  const heroTopic =
    data?.followedTopics[0] ??
    data?.trendingTopics[0] ??
    data?.newTopics[0] ??
    null;
  const heroImage = heroTopic?.bannerUrl ?? heroTopic?.imageUrl;
  const empty =
    !data ||
    (data.followedTopics.length === 0 &&
      data.trendingTopics.length === 0 &&
      data.newTopics.length === 0);

  const openTopic = (topicId: string) => router.push(`/topics/${topicId}`);
  const seeAllTopics = () => router.push("/topics");

  return (
    <Screen
      tabBar
      refreshing={home.isRefetching || me.isRefetching}
      onRefresh={refetch}
    >
      <Column spacing={6}>
        <AppText variant="title">
          {pseudonym ? `Bonjour ${pseudonym}` : "Bonjour"}
        </AppText>
        <AppText variant="body" tone="muted">
          Prêt pour ta session du jour ?
        </AppText>
      </Column>

      <Row spacing={10} alignment="start">
        <AppCard width={(width - 10) / 2} spacing={2}>
          <AppText variant="caption" tone="muted">
            Elo
          </AppText>
          <AppText variant="heading">
            {profile?.progression.provisional
              ? "Provisoire"
              : formatNumber(profile?.progression.rating ?? 0)}
          </AppText>
        </AppCard>
        <AppCard width={(width - 10) / 2} spacing={2}>
          <AppText variant="caption" tone="muted">
            Série
          </AppText>
          <AppText variant="heading">
            {`${profile?.stats.currentWinStreak ?? 0}`}
          </AppText>
          <AppText variant="caption" tone="muted">
            victoires d'affilée
          </AppText>
        </AppCard>
      </Row>

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
                      imageUrl={game.topic.imageUrl}
                      size={42}
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
          {heroTopic ? (
            <Section>
              <AppCard padding={0} spacing={0}>
                {heroImage ? (
                  <AppImage
                    source={{ uri: heroImage }}
                    width={width}
                    height={188}
                    radius={18}
                    accessibilityLabel={`Illustration de ${topicName(
                      heroTopic.names,
                      language,
                      heroTopic.topicId,
                    )}`}
                  />
                ) : (
                  <Row style={{ height: 132 }} alignment="center">
                    <Spacer flexible />
                    <TopicEmoji
                      emoji={heroTopic.emoji}
                      color={heroTopic.color}
                      size={64}
                    />
                    <Spacer flexible />
                  </Row>
                )}

                <Column spacing={8} style={{ padding: 16 }}>
                  <AppText variant="caption" tone="accent">
                    {heroTopic.categoryLabel ?? "À la une"}
                  </AppText>
                  <AppText variant="title" numberOfLines={2}>
                    {topicName(heroTopic.names, language, heroTopic.topicId)}
                  </AppText>
                  {heroTopic.description ? (
                    <AppText variant="caption" tone="muted" numberOfLines={2}>
                      {heroTopic.description}
                    </AppText>
                  ) : null}
                  <AppButton
                    label="Jouer maintenant"
                    onPress={() => router.push(`/play/${heroTopic.topicId}`)}
                  />
                </Column>
              </AppCard>
            </Section>
          ) : null}

          {data.trendingTopics.length > 0 ? (
            <Section
              title="Top 10"
              action="Tout voir"
              onAction={seeAllTopics}
            >
              <Carousel
                items={data.trendingTopics}
                itemWidth={176}
                renderItem={(topic, cardWidth) => (
                  <TopicCard
                    topic={topic}
                    width={cardWidth}
                    language={language}
                    rank={
                      data.trendingTopics.indexOf(topic) + 1
                    }
                    onPress={() => openTopic(topic.topicId)}
                  />
                )}
              />
            </Section>
          ) : null}

          {data.followedTopics.length > 0 ? (
            <Section
              title="Tes sujets"
              action="Tout voir"
              onAction={seeAllTopics}
            >
              <Carousel
                items={data.followedTopics}
                itemWidth={176}
                renderItem={(topic, cardWidth) => (
                  <TopicCard
                    topic={topic}
                    width={cardWidth}
                    language={language}
                    description
                    onPress={() => openTopic(topic.topicId)}
                  />
                )}
              />
            </Section>
          ) : null}

          {data.newTopics.length > 0 ? (
            <Section
              title="Nouveaux"
              action="À découvrir"
              onAction={seeAllTopics}
            >
              <Carousel
                items={data.newTopics}
                itemWidth={176}
                renderItem={(topic, cardWidth) => (
                  <TopicCard
                    topic={topic}
                    width={cardWidth}
                    language={language}
                    description
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
