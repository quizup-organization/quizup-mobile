import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Progress } from "@/components/ui/progress";
import { gamesService } from "@/lib/services/games";
import { useCurrentPlayer } from "@/features/shell/use-current-player";
import {
  GAME_CHOICES,
  ROUND_DURATION_SECONDS,
  useDuel,
  useStartDuel,
} from "./hooks/useDuel";
import type { GameChoice } from "@/shared/types/domain";

function DuelTimer() {
  const [left, setLeft] = useState(ROUND_DURATION_SECONDS);

  useEffect(() => {
    const id = setInterval(
      () => setLeft((current) => (current <= 1 ? 0 : current - 1)),
      1000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <View className="gap-1">
      <Progress value={(left / ROUND_DURATION_SECONDS) * 100} />
      <Text className="text-right text-xs text-muted-foreground">
        {left} s
      </Text>
    </View>
  );
}

export function DuelScreen() {
  const { gameId = "" } = useLocalSearchParams<{ gameId: string }>();
  const router = useRouter();
  const [answeredRound, setAnsweredRound] = useState<string | null>(null);
  const { profile } = useCurrentPlayer();
  const startDuel = useStartDuel();
  const {
    game,
    isLoading,
    currentRound,
    question,
    myChoice,
    myScore,
    theirScore,
    isPlayer1,
    answer,
  } = useDuel(gameId);

  if (isLoading || !game) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-sm text-muted-foreground">
          Préparation du duel…
        </Text>
      </View>
    );
  }

  const opponentName =
    (isPlayer1 ? game.player2Name : game.player1Name) ?? "Adversaire";
  const finished = game.status === "FINISHED" || game.status === "CANCELED";
  const topicId = game.topicId;

  async function quit() {
    try {
      await gamesService.cancel(gameId);
    } catch {
      // déjà terminée
    }
    router.replace(`/(app)/topic/${topicId}`);
  }

  if (finished) {
    const won = game.winnerId === (isPlayer1 ? game.player1Id : game.player2Id);
    const draw = game.winnerId == null;
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-background p-6">
        <Text className="text-2xl font-extrabold">
          {draw ? "Égalité" : won ? "Victoire !" : "Défaite"}
        </Text>
        <View className="flex-row items-center gap-6">
          <View className="items-center">
            <Text className="text-xs text-muted-foreground">Toi</Text>
            <Text className="text-3xl font-extrabold text-primary">{myScore}</Text>
          </View>
          <Text className="text-muted-foreground">–</Text>
          <View className="items-center">
            <Text className="text-xs text-muted-foreground">{opponentName}</Text>
            <Text className="text-3xl font-extrabold">{theirScore}</Text>
          </View>
        </View>
        <Button
          variant="outline"
          label="Rejouer"
          disabled={startDuel.isPending}
          onPress={() =>
            startDuel.mutate({
              topicId,
              playerName: profile?.displayName ?? "Joueur",
              difficulty: "NORMAL",
            })
          }
        />
        <Button
          label="Retour au sujet"
          onPress={() => router.replace(`/(app)/topic/${topicId}`)}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center justify-between border-b border-border p-4">
        <View className="flex-row items-center gap-3">
          <View className="items-center">
            <Text className="text-xs text-muted-foreground">Toi</Text>
            <Text className="text-lg font-extrabold text-primary">{myScore}</Text>
          </View>
          <Text className="text-muted-foreground">vs</Text>
          <View className="items-center">
            <Text className="text-xs text-muted-foreground" numberOfLines={1}>
              {opponentName}
            </Text>
            <Text className="text-lg font-extrabold">{theirScore}</Text>
          </View>
        </View>
        <Button variant="ghost" size="sm" label="Quitter" onPress={quit} />
      </View>

      <View className="flex-1 gap-4 p-4">
        {currentRound && question ? (
          <>
            <DuelTimer key={currentRound.round} />
            <Card>
              <Text className="text-xs font-semibold uppercase text-muted-foreground">
                Tour {currentRound.round.replace("ROUND_", "")}
              </Text>
              <Text className="mt-1 text-lg font-bold">{question.text}</Text>
            </Card>

            <View className="gap-2">
              {GAME_CHOICES.map((choice: GameChoice) => {
                const label = question.answers[choice];
                if (!label) return null;
                const selected = myChoice === choice;
                const roundKey = `${gameId}:${currentRound.round}`;
                const answered = myChoice != null || answeredRound === roundKey;
                return (
                  <Pressable
                    key={choice}
                    disabled={answered || answer.isPending}
                    onPress={() => {
                      setAnsweredRound(roundKey);
                      answer.mutate(choice);
                    }}
                    className={`flex-row items-center gap-3 rounded-lg border p-3.5 ${
                      selected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card"
                    } ${answered && !selected ? "opacity-60" : ""}`}
                  >
                    <Text className="font-bold">{choice}</Text>
                    <Text className="flex-1 text-sm">{label}</Text>
                  </Pressable>
                );
              })}
            </View>

            {(myChoice != null ||
              answeredRound === `${gameId}:${currentRound.round}`) && (
              <Text className="text-center text-sm text-muted-foreground">
                Réponse envoyée — en attente de l'adversaire…
              </Text>
            )}
          </>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-sm text-muted-foreground">
              {currentRound ? "Chargement de la question…" : "Round suivant…"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
