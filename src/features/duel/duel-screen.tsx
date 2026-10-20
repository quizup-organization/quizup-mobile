import { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LogOut } from "lucide-react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  Spinner,
  Typography,
  useThemeColor,
} from "heroui-native";
import { useMe } from "@/features/auth/hooks/useMe";
import { useTopicOverview } from "@/features/topic/hooks/useTopicDetail";
import { useNow } from "@/shared/hooks/useNow";
import { topicName } from "@/shared/utils/topic-name";
import { confirmAction } from "@/shared/components/confirm-dialog";
import { showToast } from "@/lib/toast";
import { gamesService } from "@/lib/services/games";
import { queryKeys } from "@/lib/query-keys";
import { localizedQuestion } from "./domain/game";
import { useGameState } from "./hooks/useGameState";
import { AnswerCard, type AnswerState } from "./components/answer-card";
import { TimerRing } from "./components/timer-ring";
import type { GameChoice } from "@/shared/types/bff";

const CHOICES: GameChoice[] = ["A", "B", "C", "D"];
const ROUND_SECONDS = 10;

export function DuelScreen() {
  const { gameId = "" } = useLocalSearchParams<{ gameId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const me = useMe();
  const userId = me.data?.userId ?? null;
  const language = me.data?.language ?? "fr";
  const { game, isLoading, isError, refresh } = useGameState(gameId);
  const topicQuery = useTopicOverview(game.topicId ?? "");
  const now = useNow(250);
  const [background] = useThemeColor(["background"]);

  const [pendingRound, setPendingRound] = useState<string | null>(null);
  const [pendingChoice, setPendingChoice] = useState<GameChoice | null>(null);

  const answer = useMutation({
    mutationFn: (choice: GameChoice) => gamesService.answer(gameId, choice),
    retry: (failureCount, error) => {
      const status = (error as { statusCode?: number }).statusCode;
      if (status && status >= 400 && status < 500 && status !== 408) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: 600,
    onError: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.games.notifications(gameId),
      });
      setPendingRound(null);
      setPendingChoice(null);
      showToast({
        title: "Réponse non envoyée",
        description: "Vérifie ta connexion et réessaie.",
        tone: "danger",
      });
    },
  });

  const currentRound = game.currentRound
    ? (game.rounds[game.currentRound] ?? null)
    : null;
  const localized = useMemo(
    () => localizedQuestion(currentRound, language),
    [currentRound, language],
  );
  const isPlayer1 = game.player1Id === userId;
  const myScore = isPlayer1 ? game.player1Score : game.player2Score;
  const theirScore = isPlayer1 ? game.player2Score : game.player1Score;
  const opponentId = isPlayer1 ? game.player2Id : game.player1Id;
  const opponentName =
    game.player2Type === "BOT"
      ? "Bot"
      : (isPlayer1 ? game.player2Name : game.player1Name) ?? "Adversaire";
  const myAnswer = userId
    ? (currentRound?.playerAnswers[userId] ?? null)
    : null;
  const theirAnswer = opponentId
    ? (currentRound?.playerAnswers[opponentId] ?? null)
    : null;
  const correctAnswer = currentRound?.correctAnswer ?? null;
  const selectedChoice =
    myAnswer?.choice ??
    (pendingRound === currentRound?.round ? pendingChoice : null);
  const revealed = correctAnswer !== null;
  const isAnswerable =
    currentRound?.phase === "ANSWERABLE" &&
    !myAnswer &&
    pendingRound !== currentRound?.round;

  const deadline = currentRound?.answerDeadlineAt
    ? Date.parse(currentRound.answerDeadlineAt)
    : null;
  const remainingMs = deadline ? Math.max(0, deadline - now) : 0;
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const progress = deadline
    ? Math.min(100, Math.max(0, (remainingMs / (ROUND_SECONDS * 1000)) * 100))
    : 0;

  useEffect(() => {
    if (myAnswer) {
      setPendingRound(null);
      setPendingChoice(null);
    }
  }, [myAnswer]);

  useEffect(() => {
    if (game.status === "FINISHED") {
      router.replace(`/(app)/duel/result/${gameId}`);
    }
  }, [game.status, gameId, router]);

  const quit = () => {
    confirmAction({
      title: "Quitter le duel ?",
      message: "Tu perdras la partie et ton adversaire sera déclaré vainqueur.",
      confirmLabel: "Quitter",
      destructive: true,
      onConfirm: () => {
        void gamesService
          .abandon(gameId)
          .catch(() => undefined)
          .finally(() => {
            if (game.topicId) {
              router.replace(`/(app)/topic/${game.topicId}`);
            } else {
              router.back();
            }
          });
      },
    });
  };

  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center gap-3"
        style={{ backgroundColor: background }}
      >
        <Spinner />
        <Typography type="body-sm" color="muted">
          Préparation du duel…
        </Typography>
      </View>
    );
  }

  if (isError) {
    return (
      <View
        className="flex-1 items-center justify-center gap-4 px-6"
        style={{ backgroundColor: background }}
      >
        <Typography type="h5">Duel indisponible</Typography>
        <Button variant="secondary" onPress={refresh}>
          Réessayer
        </Button>
        <Button variant="ghost" onPress={() => router.back()}>
          Retour
        </Button>
      </View>
    );
  }

  if (game.status === "CANCELED") {
    return (
      <View
        className="flex-1 items-center justify-center gap-4 px-6"
        style={{ backgroundColor: background }}
      >
        <Typography type="h3">Duel annulé</Typography>
        <Typography type="body-sm" color="muted" align="center">
          {game.canceledReason ?? "La partie a été annulée."}
        </Typography>
        <Button
          onPress={() => {
            if (game.topicId) {
              router.replace(`/(app)/topic/${game.topicId}`);
            } else {
              router.back();
            }
          }}
        >
          Retour au sujet
        </Button>
      </View>
    );
  }

  const topic = topicQuery.data?.topic;
  const topicLabel = topic ? topicName(topic.names, language) : "Duel";
  const answerState = (choice: GameChoice): AnswerState => {
    if (revealed) {
      if (choice === correctAnswer) return "correct";
      if (myAnswer?.choice === choice) return "wrong";
      return "disabled";
    }
    if (selectedChoice === choice) return "selected";
    return isAnswerable ? "idle" : "disabled";
  };

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: background }}
      contentContainerStyle={{
        paddingTop: insets.top + 12,
        paddingHorizontal: 20,
        paddingBottom: insets.bottom + 40,
        gap: 16,
      }}
    >
      <View className="flex-row items-center justify-between gap-3">
        <View className="min-w-0 flex-1 gap-1">
          <Typography type="body-xs" color="muted">
            {topicLabel}
          </Typography>
          <Typography type="h5">
            {currentRound
              ? currentRound.round.replace("ROUND_", "Tour ")
              : "Duel"}
          </Typography>
        </View>
        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          onPress={quit}
          accessibilityLabel="Quitter le duel"
        >
          <LogOut size={18} color="#A0A0A0" />
        </Button>
      </View>

      <Card>
        <Card.Body className="flex-row items-center justify-around">
          <View className="items-center gap-1">
            <Typography type="body-xs" color="muted">
              Toi
            </Typography>
            <Typography type="h2" className="text-accent">
              {myScore}
            </Typography>
          </View>
          <Typography type="body-sm" color="muted">
            vs
          </Typography>
          <View className="items-center gap-1">
            <Typography type="body-xs" color="muted" numberOfLines={1}>
              {opponentName}
            </Typography>
            <Typography type="h2">{theirScore}</Typography>
          </View>
        </Card.Body>
      </Card>

      {currentRound ? (
        <>
          <View className="flex-row items-center justify-between gap-4">
            <TimerRing
              progress={isAnswerable ? progress / 100 : 0}
              seconds={isAnswerable ? remainingSeconds : 0}
            />
            <View className="flex-1 gap-1">
              <Typography type="body-sm" weight="semibold">
                {currentRound.phase === "QUESTION_SHOWN"
                  ? "La question arrive…"
                  : isAnswerable
                    ? "À toi de jouer"
                    : myAnswer
                      ? "Réponse envoyée"
                      : revealed
                        ? "Round terminé"
                        : "En attente"}
              </Typography>
              {theirAnswer ? (
                <Typography type="body-xs" color="muted">
                  {opponentName} a répondu
                </Typography>
              ) : null}
            </View>
          </View>

          <Card>
            <Card.Body className="gap-3">
              <Typography type="h5">{localized.questionText}</Typography>
              {currentRound.imageUrl ? (
                <Image
                  source={{ uri: currentRound.imageUrl }}
                  style={{ width: "100%", height: 160, borderRadius: 12 }}
                  contentFit="cover"
                  transition={150}
                />
              ) : null}
            </Card.Body>
          </Card>

          <View className="flex-row flex-wrap justify-between gap-y-3">
            {CHOICES.map((choice) => {
              const label = localized.answers[choice];
              if (!label) return null;
              return (
                <AnswerCard
                  key={choice}
                  choice={choice}
                  label={label}
                  state={answerState(choice)}
                  onPress={() => {
                    if (!isAnswerable || !currentRound) return;
                    setPendingRound(currentRound.round);
                    setPendingChoice(choice);
                    answer.mutate(choice);
                  }}
                />
              );
            })}
          </View>

          {myAnswer ? (
            <Typography type="body-sm" color="muted" align="center">
              {revealed
                ? myAnswer.correct
                  ? `Bonne réponse · +${myAnswer.points} points`
                  : `Mauvaise réponse · ${correctAnswer ?? "?"}`
                : "Réponse envoyée — en attente de l'adversaire…"}
            </Typography>
          ) : currentRound.phase === "CLOSED" ? (
            <Typography type="body-sm" color="muted" align="center">
              Round terminé — préparation du suivant…
            </Typography>
          ) : null}
        </>
      ) : (
        <View className="items-center py-16">
          <Spinner />
          <Typography type="body-sm" color="muted" className="mt-3">
            Le premier round arrive…
          </Typography>
        </View>
      )}
    </ScrollView>
  );
}
