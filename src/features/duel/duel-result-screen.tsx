import { ScrollView, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RotateCcw, Swords } from "lucide-react-native";
import {
  Button,
  Card,
  Spinner,
  Typography,
  useThemeColor,
} from "heroui-native";
import { useMe } from "@/features/auth/hooks/useMe";
import { topicName } from "@/shared/utils/topic-name";
import { ProgressBar } from "@/shared/components/progress-bar";
import { UserAvatar } from "@/shared/components/user-avatar";
import { useGameResult } from "./hooks/useGameResult";
import { useStartBotRoom } from "./hooks/useRoom";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <View className="flex-1 items-center gap-1">
      <Typography type="body-xs" color="muted" align="center">
        {label}
      </Typography>
      <Typography type="h5">{value}</Typography>
    </View>
  );
}

export function DuelResultScreen() {
  const { gameId = "" } = useLocalSearchParams<{ gameId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const me = useMe();
  const resultQuery = useGameResult(gameId);
  const replay = useStartBotRoom();
  const [background] = useThemeColor(["background"]);

  if (resultQuery.isPending) {
    return (
      <View
        className="flex-1 items-center justify-center gap-3"
        style={{ backgroundColor: background }}
      >
        <Spinner />
        <Typography type="body-sm" color="muted">
          Chargement du résultat…
        </Typography>
      </View>
    );
  }

  if (!resultQuery.data) {
    return (
      <View
        className="flex-1 items-center justify-center gap-4 px-6"
        style={{ backgroundColor: background }}
      >
        <Typography type="h5">Résultat indisponible</Typography>
        <Button variant="secondary" onPress={() => void resultQuery.refetch()}>
          Réessayer
        </Button>
      </View>
    );
  }

  const result = resultQuery.data;
  const language = me.data?.language ?? "fr";
  const userId = me.data?.userId ?? null;
  const won = result.winnerId !== null && result.winnerId === userId;
  const draw = result.winnerId === null;
  const opponentName =
    result.opponent?.pseudonym ?? (result.botGame ? "Bot" : "Adversaire");
  const topic = topicName(result.topic.names, language);

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: background }}
      contentContainerStyle={{
        paddingTop: insets.top + 24,
        paddingHorizontal: 20,
        paddingBottom: insets.bottom + 40,
        gap: 16,
      }}
    >
      <View className="items-center gap-2">
        <Typography type="h1">
          {draw ? "Égalité" : won ? "Victoire !" : "Défaite"}
        </Typography>
        <Typography type="body-sm" color="muted">
          {topic} · contre {opponentName}
        </Typography>
      </View>

      <Card>
        <Card.Body className="flex-row items-center justify-around">
          <View className="items-center gap-1">
            <UserAvatar name={me.data?.pseudonym ?? "Toi"} size="md" />
            <Typography type="body-xs" color="muted">
              Toi
            </Typography>
            <Typography type="h2" className="text-accent">
              {result.myScore}
            </Typography>
          </View>
          <Typography type="body-sm" color="muted">
            vs
          </Typography>
          <View className="items-center gap-1">
            <UserAvatar name={opponentName} size="md" />
            <Typography type="body-xs" color="muted">
              {opponentName}
            </Typography>
            <Typography type="h2">{result.opponentScore}</Typography>
          </View>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="gap-3">
          <Typography type="body-sm" weight="semibold">
            Performance
          </Typography>
          <View className="flex-row gap-2">
            <Stat label="Points de base" value={result.basePoints} />
            <Stat label="Bonus vitesse" value={result.speedBonus} />
            <Stat label="Bonnes réponses" value={result.correctAnswers} />
          </View>
          <View className="flex-row gap-2">
            <Stat label="Réponses rapides" value={result.fastAnswers} />
            <Stat
              label="Rounds répondus"
              value={`${result.answeredRounds}/${result.totalRounds}`}
            />
            <Stat label="Niveau adverse" value={result.opponentLevel || "—"} />
          </View>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="gap-3">
          <View className="flex-row items-center justify-between">
            <Typography type="body-sm" weight="semibold">
              Récompense
            </Typography>
            <Typography type="h5" className="text-accent">
              {result.reward ? `+${result.reward.xp} XP` : "Calcul…"}
            </Typography>
          </View>
          {result.botGame ? (
            <Typography type="body-xs" color="muted">
              Entraînement contre un bot : aucune XP ni progression.
            </Typography>
          ) : result.reward ? (
            <Typography type="body-xs" color="muted">
              {result.reward.victoryBonus > 0
                ? `Dont +${result.reward.victoryBonus} XP de victoire`
                : "XP de la partie"}
            </Typography>
          ) : (
            <Typography type="body-xs" color="muted">
              La récompense est en cours de projection…
            </Typography>
          )}
          <View className="gap-2 border-t border-separator pt-3">
            <View className="flex-row items-center justify-between">
              <Typography type="body-xs" color="muted">
                Niveau {result.progression.level}
              </Typography>
              <Typography type="body-xs" color="muted">
                {result.progression.xpTotal} XP
              </Typography>
            </View>
            <ProgressBar value={result.progression.levelProgressPercent} />
          </View>
        </Card.Body>
      </Card>

      <View className="gap-3">
        <Button
          isDisabled={replay.isPending}
          onPress={() =>
            replay.mutate({
              topicId: result.topic.topicId,
              difficulty: result.botDifficulty ?? "NORMAL",
            })
          }
        >
          <RotateCcw size={16} color="#EFF6FF" />
          <Button.Label>
            {replay.isPending ? "Préparation…" : "Rejouer contre un bot"}
          </Button.Label>
        </Button>
        <Button
          variant="outline"
          onPress={() =>
            router.replace(`/(app)/topic/${result.topic.topicId}`)
          }
        >
          <Swords size={16} color="#A0A0A0" />
          <Button.Label>Retour au sujet</Button.Label>
        </Button>
      </View>
    </ScrollView>
  );
}
