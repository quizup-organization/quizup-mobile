import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import {
  AppButton,
  AppCard,
  AppText,
  Column,
  Grid,
  ProgressBar,
  Row,
  Screen,
  Section,
  Spacer,
} from "@/components";
import { useAbandonGame } from "@/features/game/hooks/use-abandon-game";
import { useAnswerQuestion } from "@/features/game/hooks/use-answer-question";
import { useGameState } from "@/features/game/hooks/use-game-state";
import { ROUNDS, ROUND_SECONDS } from "@/features/game/domain/game-constants";
import {
  answerDeadlineMs,
  currentRound,
  localizedQuestion,
} from "@/features/game/domain/game";
import type { GameChoice } from "@/features/game/domain/game-dto";
import { useMe } from "@/features/profile/hooks/use-me";
import type { ApiError } from "@/shared/types/api";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";

const CHOICE_ORDER: GameChoice[] = ["A", "B", "C", "D"];

export function GamePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const gameId = id ?? "";
  return <GameArena key={gameId} gameId={gameId} />;
}

function GameArena({ gameId }: { gameId: string }) {
  const router = useRouter();
  const me = useMe();
  const state = useGameState(gameId);
  const answer = useAnswerQuestion(gameId);
  const abandon = useAbandonGame(gameId);
  const [selected, setSelected] = useState<GameChoice | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const game = state.game;
  const round = currentRound(game);
  const meId = me.data?.userId ?? "";
  const isPlayer1 = game.player1Id === meId;
  const myScore = isPlayer1 ? game.player1Score : game.player2Score;
  const opponentScore = isPlayer1 ? game.player2Score : game.player1Score;
  const opponentName =
    (isPlayer1 ? game.player2Name : game.player1Name) ??
    (game.player2Type === "BOT" ? "Bot" : "Adversaire");
  const language = me.data?.language ?? "fr";
  const question = useMemo(
    () => localizedQuestion(round, language),
    [round, language],
  );
  const myAnswer = round?.playerAnswers[meId];
  const deadline = answerDeadlineMs(round);
  const remainingMs = deadline == null ? 0 : Math.max(0, deadline - now);
  const ratio =
    deadline == null
      ? 1
      : Math.min(1, remainingMs / (ROUND_SECONDS * 1000));
  const choice = (myAnswer?.choice ?? selected) as GameChoice | null;
  const roundNumber = round
    ? Object.keys(game.rounds).indexOf(round.round) + 1
    : 0;
  const canAnswer =
    game.status === "IN_PROGRESS" &&
    round?.phase === "ANSWERABLE" &&
    !myAnswer &&
    !selected &&
    remainingMs > 0 &&
    !answer.isPending;

  const choices = CHOICE_ORDER.map((item) => ({
    key: item,
    label: question.answers[item],
  })).filter((item) => typeof item.label === "string");

  useEffect(() => {
    if (game.status !== "IN_PROGRESS") return;
    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(interval);
  }, [game.status]);

  useEffect(() => {
    setSelected(null);
  }, [round?.round]);

  useEffect(() => {
    if (game.status !== "FINISHED") return;
    const timeout = setTimeout(() => {
      router.replace(`/games/${gameId}/result`);
    }, 1_200);
    return () => clearTimeout(timeout);
  }, [game.status, gameId, router]);

  function submit(nextChoice: GameChoice) {
    if (!canAnswer) return;
    setSelected(nextChoice);
    answer.mutate(nextChoice, {
      onSuccess: () => void state.refetch(),
      onError: (error) => {
        if ((error as ApiError).statusCode !== 409) setSelected(null);
      },
    });
  }

  function confirmQuit() {
    Alert.alert(
      "Quitter le duel ?",
      "Tu perdras la partie par forfait.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Quitter",
          style: "destructive",
          onPress: () => {
            abandon.mutate(undefined, {
              onSuccess: () => void state.refetch(),
              onError: () =>
                Alert.alert("Erreur", "Impossible d'abandonner la partie."),
            });
          },
        },
      ],
    );
  }

  if (state.isLoading || me.isLoading) {
    return (
      <Screen topInset>
        <LoadingState label="Préparation de l'arène…" />
      </Screen>
    );
  }

  if (state.isError || me.isError) {
    return (
      <Screen topInset>
        <ErrorState
          message="Impossible de charger cette partie."
          onRetry={() => {
            void state.refetch();
            void me.refetch();
          }}
        />
      </Screen>
    );
  }

  if (game.status === "CANCELED") {
    return (
      <Screen topInset>
        <EmptyState
          title="Partie annulée"
          subtitle={game.canceledReason ?? "Cette partie n'a pas pu démarrer."}
        />
        <AppButton
          label="Retour au sujet"
          onPress={() =>
            router.replace(
              game.topicId ? `/topics/${game.topicId}` : "/",
            )
          }
        />
      </Screen>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Screen topInset>
        <Row spacing={8} alignment="center">
          <AppButton
            label="Quitter"
            variant="text"
            onPress={confirmQuit}
            disabled={abandon.isPending}
          />
          <Spacer flexible />
          {round ? (
            <AppText variant="caption" tone="muted">
              {round.bonus
                ? "Question bonus"
                : `Question ${roundNumber}/${ROUNDS}`}
            </AppText>
          ) : null}
        </Row>

        <AppCard>
          <Row spacing={12} alignment="center">
            <Column spacing={2}>
              <AppText variant="caption" tone="muted">
                Toi
              </AppText>
              <AppText variant="title">{myScore}</AppText>
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
              <AppText variant="title">{opponentScore}</AppText>
            </Column>
          </Row>
        </AppCard>

        <Section>
          <AppCard>
            <AppText variant="caption" tone="accent">
              {round?.phase === "CLOSED"
                ? "Manche terminée"
                : round?.phase === "ANSWERABLE"
                  ? "À toi de répondre"
                  : "La question arrive…"}
            </AppText>
            <AppText variant="title">
              {round ? question.questionText : "Préparation du duel…"}
            </AppText>
            {round?.phase === "ANSWERABLE" && !myAnswer ? (
              <Column spacing={4}>
                <ProgressBar value={ratio} label="Temps restant" />
                <AppText variant="caption" tone="muted">
                  {`${Math.ceil(remainingMs / 1000)} s`}
                </AppText>
              </Column>
            ) : null}
          </AppCard>
        </Section>

        <Section title="Réponses">
          <Grid
            items={choices}
            columns={1}
            gap={8}
            renderItem={(item, width) => {
              const chosen = choice === item.key;
              return (
                <AppButton
                  label={`${item.key}. ${item.label}`}
                  variant={chosen ? "filled" : "outlined"}
                  disabled={!canAnswer}
                  style={{ width }}
                  onPress={() => submit(item.key)}
                />
              );
            }}
          />

          {round?.phase === "ANSWERABLE" && !myAnswer ? (
            <AppText variant="caption" tone="muted" align="center">
              {answer.isPending ? "Envoi de ta réponse…" : "Choisis une réponse."}
            </AppText>
          ) : null}

          {myAnswer ? (
            <AppText
              variant="caption"
              tone={myAnswer.correct ? "accent" : "danger"}
              align="center"
            >
              {myAnswer.correct
                ? "Bonne réponse !"
                : round?.phase === "CLOSED"
                  ? "Mauvaise réponse."
                  : "Réponse envoyée. En attente de la manche suivante…"}
            </AppText>
          ) : null}

          {round?.phase === "CLOSED" && round.correctAnswer ? (
            <AppText variant="caption" tone="accent" align="center">
              {`Bonne réponse : ${
                question.answers[round.correctAnswer] ?? round.correctAnswer
              }`}
            </AppText>
          ) : null}

          {round?.phase === "QUESTION_SHOWN" ? (
            <AppText variant="caption" tone="muted" align="center">
              Attends la révélation de la question.
            </AppText>
          ) : null}
        </Section>

        <AppText variant="caption" tone="muted" align="center">
          {`Duel contre ${opponentName}`}
        </AppText>
      </Screen>
    </>
  );
}
