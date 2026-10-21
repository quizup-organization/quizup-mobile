import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import {
  AppAvatar,
  AppButton,
  AppCard,
  AppText,
  Column,
  ProgressBar,
  Row,
  Screen,
  Section,
  Spacer,
} from "@/components";
import { TopicEmoji } from "@/features/topics/components/topic-emoji";
import { topicName } from "@/features/topics/domain/topic";
import { useSetTopicFollow } from "@/features/topic/hooks/use-set-topic-follow";
import { useTopicLeaderboard } from "@/features/topic/hooks/use-topic-leaderboard";
import { useTopicOverview } from "@/features/topic/hooks/use-topic-overview";
import { useMe } from "@/features/profile/hooks/use-me";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { formatNumber, initials } from "@/shared/utils/format";

export function TopicPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const topicId = id ?? "";

  const me = useMe();
  const overview = useTopicOverview(topicId);
  const leaderboard = useTopicLeaderboard(topicId, { size: 5 });
  const follow = useSetTopicFollow(topicId);

  const refetch = () => {
    void overview.refetch();
    void leaderboard.refetch();
  };

  if (overview.isLoading || leaderboard.isLoading || me.isLoading) {
    return (
      <Screen>
        <LoadingState label="Chargement du sujet…" />
      </Screen>
    );
  }

  if (overview.isError || leaderboard.isError || !overview.data) {
    return (
      <Screen>
        <ErrorState
          message="Impossible de charger ce sujet."
          onRetry={refetch}
        />
        <Row spacing={8} alignment="center">
          <AppButton
            label="Retour"
            variant="text"
            onPress={() => router.back()}
          />
        </Row>
      </Screen>
    );
  }

  const data = overview.data;
  const topic = data.topic;
  const progress = data.myProgress;
  const language = me.data?.language ?? "fr";
  const name = topicName(topic.names, language, topic.topicId);
  const entries = leaderboard.data?.entries.content ?? [];
  const myId = me.data?.userId;
  const meEntry = leaderboard.data?.me ?? null;
  const hasMe = entries.some((entry) => entry.userId === myId);
  const displayEntries =
    !hasMe && meEntry ? [...entries, meEntry] : entries;

  return (
    <>
      <Stack.Screen options={{ title: name }} />
      <Screen refreshing={overview.isRefetching} onRefresh={refetch}>
      <Row spacing={8} alignment="center" onPress={() => router.back()}>
        <AppText variant="label" tone="accent">
          Retour
        </AppText>
      </Row>

      <Section>
        <AppCard>
          <Row spacing={14} alignment="center">
            <TopicEmoji emoji={topic.emoji} color={topic.color} size={56} />
            <Column spacing={2}>
              <AppText variant="title" numberOfLines={1}>
                {name}
              </AppText>
              <AppText variant="caption" tone="muted">
                {topic.categoryLabel ?? "Sujet"}
              </AppText>
            </Column>
            <Spacer flexible />
            <AppButton
              variant={topic.followed ? "text" : "outlined"}
              label={topic.followed ? "Suivi" : "Suivre"}
              disabled={follow.isPending}
              onPress={() => follow.mutate(!topic.followed)}
            />
          </Row>

          <AppText variant="body" tone="muted">
            {topic.description ?? "Aucune description pour ce sujet."}
          </AppText>

          <Row spacing={12} alignment="center">
            <AppText variant="caption" tone="muted">
              {`${formatNumber(topic.followersCount)} abonnés`}
            </AppText>
            <AppText variant="caption" tone="muted">
              {`${topic.questionsCount} questions`}
            </AppText>
            {data.myRank ? (
              <AppText variant="caption" tone="accent">
                {`#${data.myRank}`}
              </AppText>
            ) : null}
          </Row>
        </AppCard>
      </Section>

      <Section title="Ma progression">
        <AppCard>
          <Row spacing={8} alignment="center">
            <AppText variant="label">{`Niveau ${progress.level} · ${progress.title}`}</AppText>
            <Spacer flexible />
            <AppText variant="caption" tone="muted">
              {`${formatNumber(progress.xp)} / ${formatNumber(progress.xpForNextLevel)} XP`}
            </AppText>
          </Row>
          <Row alignment="center">
            <ProgressBar
              value={progress.levelProgressPercent / 100}
              label="Progression du niveau"
            />
          </Row>
          <Row spacing={8} alignment="center">
            <AppText variant="caption" tone="muted">
              {`Grade : ${progress.grade}`}
            </AppText>
            <Spacer flexible />
            <AppText variant="caption" tone="muted">
              {`${progress.completedQuestions} / ${progress.totalQuestions} questions`}
            </AppText>
          </Row>
          <Row alignment="center">
            <ProgressBar
              value={progress.completionPercent / 100}
              label="Complétion du sujet"
            />
          </Row>
        </AppCard>
      </Section>

      <Section title="Classement" action="Top 5">
        {displayEntries.length === 0 ? (
          <EmptyState
            title="Pas encore de classement"
            subtitle="Joue une partie pour apparaître ici."
          />
        ) : (
          <Column spacing={4}>
            {displayEntries.map((entry) => {
              const isMe = entry.userId === myId;
              return (
                <Row
                  key={entry.userId}
                  spacing={12}
                  alignment="center"
                  style={{ paddingVertical: 6 }}
                >
                  <AppText
                    variant="caption"
                    tone={entry.rank <= 3 ? "accent" : "muted"}
                  >
                    {`#${entry.rank}`}
                  </AppText>
                  <AppAvatar
                    initials={initials(entry.pseudonym ?? "Joueur")}
                    size={34}
                  />
                  <Column spacing={2}>
                    <AppText variant="label">
                      {isMe ? "Toi" : (entry.pseudonym ?? "Joueur")}
                    </AppText>
                    <AppText variant="caption" tone="muted">
                      {`Niveau ${entry.level}`}
                    </AppText>
                  </Column>
                  <Spacer flexible />
                  <AppText variant="caption" tone="muted">
                    {`${formatNumber(entry.totalXp)} XP`}
                  </AppText>
                </Row>
              );
            })}
          </Column>
        )}
      </Section>

      <AppText variant="caption" tone="muted" align="center">
        Les duels et salles arrivent dans une prochaine étape.
      </AppText>
      </Screen>
    </>
  );
}
