import { useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import {
  AppAvatar,
  AppButton,
  AppCard,
  AppChip,
  AppImage,
  AppText,
  Carousel,
  Column,
  ProgressBar,
  Row,
  Screen,
  Section,
  Spacer,
} from "@/components";
import { useCreateBotRoom } from "@/features/rooms/hooks/use-create-bot-room";
import { TopicEmoji } from "@/features/topics/components/topic-emoji";
import { masteryGradeLabel } from "@/features/topics/domain/mastery";
import { topicName } from "@/features/topics/domain/topic";
import { useSetTopicFollow } from "@/features/topic/hooks/use-set-topic-follow";
import { useTopicLeaderboard } from "@/features/topic/hooks/use-topic-leaderboard";
import { useTopicOverview } from "@/features/topic/hooks/use-topic-overview";
import { useMe } from "@/features/profile/hooks/use-me";
import { useContentWidth } from "@/hooks/use-content-width";
import { isMockData } from "@/lib/config";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { formatNumber } from "@/shared/utils/format";

type TopicTab = "progress" | "leaderboard" | "titles";

const TAB_LABELS: Record<TopicTab, string> = {
  progress: "Ma progression",
  leaderboard: "Classement",
  titles: "Titres",
};

export function TopicPage() {
  const router = useRouter();
  const width = useContentWidth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const topicId = id ?? "";
  const [tab, setTab] = useState<TopicTab>("leaderboard");

  const me = useMe();
  const overview = useTopicOverview(topicId);
  const leaderboard = useTopicLeaderboard(topicId, { size: 5 });
  const follow = useSetTopicFollow(topicId);
  const createBotRoom = useCreateBotRoom();

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
  const displayEntries = !hasMe && meEntry ? [...entries, meEntry] : entries;
  const banner = topic.bannerUrl ?? topic.imageUrl;
  const titles = data.titles?.[language] ?? data.titles?.fr ?? {};
  const titleEntries = Object.entries(titles);

  return (
    <>
      <Stack.Screen options={{ title: name }} />
      <Screen refreshing={overview.isRefetching} onRefresh={refetch}>
        <Row spacing={8} alignment="center" onPress={() => router.back()}>
          <AppText variant="label" tone="accent">
            Retour
          </AppText>
        </Row>

        <AppCard padding={0} spacing={0}>
          {banner ? (
            <AppImage
              source={{ uri: banner }}
              width={width}
              height={190}
              radius={18}
              accessibilityLabel={`Bannière de ${name}`}
            />
          ) : null}

          <Column spacing={10} style={{ padding: 16 }}>
            <Row spacing={12} alignment="center">
              <TopicEmoji
                emoji={topic.emoji}
                color={topic.color}
                imageUrl={topic.imageUrl}
                size={56}
              />
              <Column spacing={2}>
                <AppText variant="title" numberOfLines={2}>
                  {name}
                </AppText>
                <AppText variant="caption" tone="accent">
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
                <AppChip label={`Rang #${data.myRank}`} selected />
              ) : null}
            </Row>

            <AppButton
              label={
                createBotRoom.isPending ? "Préparation…" : "Lancer un duel"
              }
              disabled={createBotRoom.isPending || isMockData}
              style={{ width: width - 32 }}
              onPress={() =>
                createBotRoom.mutate(topicId, {
                  onSuccess: (room) => router.push(`/rooms/${room.id}`),
                })
              }
            />
            {isMockData ? (
              <AppText variant="caption" tone="muted">
                Le duel est disponible en mode connecté.
              </AppText>
            ) : null}
            {createBotRoom.isError ? (
              <AppText variant="caption" tone="danger">
                Impossible de préparer le duel. Réessaie.
              </AppText>
            ) : null}
          </Column>
        </AppCard>

        <Carousel
          items={(Object.keys(TAB_LABELS) as TopicTab[]).map((item) => ({
            id: item,
            label: TAB_LABELS[item],
          }))}
          renderItem={(item) => (
            <AppChip
              label={item.label}
              selected={tab === item.id}
              onPress={() => setTab(item.id)}
            />
          )}
        />

        {tab === "progress" ? (
          <Section title="Ma maîtrise">
            <AppCard>
              <Row spacing={8} alignment="center">
                <AppText variant="label">
                  {`${masteryGradeLabel(progress.grade)} · ${formatNumber(progress.xp)} XP`}
                </AppText>
                <Spacer flexible />
                <AppText variant="caption" tone="muted">
                  {progress.nextGrade
                    ? `Vers ${masteryGradeLabel(progress.nextGrade)}`
                    : "Grade maximal"}
                </AppText>
              </Row>
              <Row alignment="center">
                <ProgressBar
                  value={progress.gradeProgressPercent / 100}
                  label="Progression du grade"
                />
              </Row>
              <AppText variant="caption" tone="muted">
                {progress.nextGrade
                  ? `${formatNumber(progress.gradeRemainingXp)} XP pour atteindre le grade suivant.`
                  : "Tu as atteint le plus haut grade de ce sujet."}
              </AppText>
              <Row spacing={8} alignment="center">
                <AppText variant="caption" tone="muted">
                  {`${progress.games} parties`}
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
        ) : null}

        {tab === "leaderboard" ? (
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
                        name={entry.pseudonym ?? "Joueur"}
                        userId={entry.userId}
                        avatarOptions={entry.avatarOptions}
                        size={34}
                      />
                      <Column spacing={2}>
                        <AppText variant="label">
                          {isMe ? "Toi" : (entry.pseudonym ?? "Joueur")}
                        </AppText>
                        <AppText variant="caption" tone="muted">
                          {entry.provisional
                            ? "Elo provisoire"
                            : `Elo ${formatNumber(entry.rating)}`}
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
        ) : null}

        {tab === "titles" ? (
          <Section title="Titres du sujet">
            {titleEntries.length === 0 ? (
              <EmptyState
                title="Aucun titre débloqué"
                subtitle="Atteins les grades de maîtrise pour débloquer les titres thématiques."
              />
            ) : (
              <Column spacing={8}>
                {titleEntries.map(([grade, title]) => (
                  <AppCard key={grade}>
                    <Row spacing={10} alignment="center">
                      <AppText variant="caption" tone="muted" width={100}>
                        {masteryGradeLabel(grade)}
                      </AppText>
                      <AppText variant="label">{title}</AppText>
                    </Row>
                  </AppCard>
                ))}
              </Column>
            )}
          </Section>
        ) : null}
      </Screen>
    </>
  );
}
