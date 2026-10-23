import { useEffect, useRef } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import {
  AppButton,
  AppCard,
  AppChip,
  AppText,
  Column,
  Grid,
  ProgressBar,
  Row,
  Screen,
  Section,
  Spacer,
} from "@/components";
import { useCreateBotRoom } from "@/features/rooms/hooks/use-create-bot-room";
import { useGameResult } from "@/features/game/hooks/use-game-result";
import { masteryGradeLabel } from "@/features/topics/domain/mastery";
import { topicName } from "@/features/topics/domain/topic";
import { useMe } from "@/features/profile/hooks/use-me";
import { useSession } from "@/features/auth";
import { queryKeys } from "@/lib/query-keys";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { formatNumber } from "@/shared/utils/format";

function outcomeLabel(
  winnerId: string | null,
  userId: string,
): { title: string; tone: "accent" | "danger" | "muted" } {
  if (winnerId == null) return { title: "Match nul", tone: "muted" };
  return winnerId === userId
    ? { title: "Victoire", tone: "accent" }
    : { title: "Défaite", tone: "danger" };
}

export function GameResultPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();
  const gameId = id ?? "";
  const resultQuery = useGameResult(gameId);
  const me = useMe();
  const session = useSession();
  const createBotRoom = useCreateBotRoom();
  const result = resultQuery.data;
  const userId = me.data?.userId ?? session?.userId ?? "";
  const invalidated = useRef(false);

  useEffect(() => {
    if (!result || invalidated.current) return;
    invalidated.current = true;
    void queryClient.invalidateQueries({ queryKey: queryKeys.me() });
    void queryClient.invalidateQueries({ queryKey: queryKeys.home() });
    void queryClient.invalidateQueries({ queryKey: queryKeys.games.active() });
    void queryClient.invalidateQueries({ queryKey: queryKeys.topics.all });
    void queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all });
  }, [queryClient, result]);

  if (resultQuery.isLoading) {
    return (
      <Screen>
        <LoadingState label="Calcul du résultat…" />
      </Screen>
    );
  }

  if (resultQuery.isError || !result) {
    return (
      <Screen>
        <ErrorState
          message="Impossible de charger le résultat."
          onRetry={() => void resultQuery.refetch()}
        />
      </Screen>
    );
  }

  const outcome = outcomeLabel(result.winnerId, userId);
  const language = me.data?.language ?? "fr";
  const name = topicName(result.topic.names, language, result.topic.topicId);
  const opponentName =
    result.opponent?.pseudonym ??
    (result.opponentDeleted
      ? "Joueur supprimé"
      : result.botGame
        ? "Bot"
        : "Adversaire");
  const reward = result.reward;
  const grade = masteryGradeLabel(result.topicMastery.grade);

  return (
    <>
      <Stack.Screen options={{ title: "Résultat" }} />
      <Screen
        refreshing={resultQuery.isRefetching}
        onRefresh={() => void resultQuery.refetch()}
      >
        <Section>
          <Column spacing={8} alignment="center">
            <AppText variant="display" tone={outcome.tone} align="center">
              {outcome.title}
            </AppText>
            <AppText variant="body" tone="muted" align="center">
              {name}
            </AppText>
            <Row spacing={8} alignment="center">
              {result.botGame ? <AppChip label="Duel bot" /> : null}
              <AppChip label={result.rated ? "Classé" : "Non classé"} />
            </Row>
          </Column>
        </Section>

        <AppCard>
          <Row spacing={16} alignment="center">
            <Column spacing={2}>
              <AppText variant="caption" tone="muted">
                Toi
              </AppText>
              <AppText variant="display">{result.myScore}</AppText>
            </Column>
            <Spacer flexible />
            <AppText variant="heading" tone="muted">
              VS
            </AppText>
            <Spacer flexible />
            <Column spacing={2} alignment="end">
              <AppText variant="caption" tone="muted">
                {opponentName}
              </AppText>
              <AppText variant="display">{result.opponentScore}</AppText>
            </Column>
          </Row>
        </AppCard>

        <Section>
          <Grid
            items={[
              {
                label: "Elo",
                value: formatNumber(result.progression.rating),
                detail:
                  (result.eloDelta ?? 0) === 0
                    ? undefined
                    : `${(result.eloDelta ?? 0) > 0 ? "+" : ""}${result.eloDelta}`,
              },
              {
                label: "XP",
                value: reward == null ? "…" : `+${formatNumber(reward.xp)}`,
                detail:
                  reward && reward.victoryBonus > 0
                    ? `+${formatNumber(reward.victoryBonus)} bonus`
                    : undefined,
              },
              {
                label: "Bonnes réponses",
                value: `${result.correctAnswers}/${result.totalRounds}`,
              },
            ]}
            columns={3}
            gap={10}
            renderItem={(item, width) => (
              <AppCard width={width}>
                <AppText variant="heading">{item.value}</AppText>
                {item.detail ? (
                  <AppText variant="caption" tone="accent">
                    {item.detail}
                  </AppText>
                ) : null}
                <AppText variant="caption" tone="muted">
                  {item.label}
                </AppText>
              </AppCard>
            )}
          />
        </Section>

        <Section title="Maîtrise du sujet">
          <AppCard>
            <Row spacing={8} alignment="center">
              <AppText variant="label">{`${grade} · ${formatNumber(result.topicMastery.xp)} XP`}</AppText>
              <Spacer flexible />
              <AppText variant="caption" tone="accent">
                {`+${formatNumber(result.topicMastery.xpGained)} XP`}
              </AppText>
            </Row>
            <ProgressBar
              value={result.topicMastery.gradeProgressPercent / 100}
              label="Progression du grade"
            />
            <AppText variant="caption" tone="muted">
              {result.topicMastery.nextGrade
                ? `${formatNumber(result.topicMastery.gradeRemainingXp)} XP avant ${masteryGradeLabel(result.topicMastery.nextGrade)}.`
                : "Grade maximal atteint sur ce sujet."}
            </AppText>
          </AppCard>
        </Section>

        <Section>
          <Column spacing={8}>
            {createBotRoom.isError ? (
              <AppText variant="caption" tone="danger" align="center">
                Impossible de préparer une nouvelle partie.
              </AppText>
            ) : null}
            <AppButton
              label={createBotRoom.isPending ? "Préparation…" : "Rejouer"}
              disabled={createBotRoom.isPending}
              onPress={() =>
                createBotRoom.mutate(result.topic.topicId, {
                  onSuccess: (room) => router.replace(`/rooms/${room.id}`),
                })
              }
            />
            <AppButton
              label="Retour au sujet"
              variant="outlined"
              onPress={() =>
                router.replace(`/topics/${result.topic.topicId}`)
              }
            />
          </Column>
        </Section>

        {reward == null ? (
          <AppText variant="caption" tone="muted" align="center">
            La récompense est en cours de calcul…
          </AppText>
        ) : null}
      </Screen>
    </>
  );
}
