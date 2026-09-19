import { useState } from "react";
import { Pressable, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Screen } from "@/components/screen";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { StatStrip } from "@/components/stat-strip";
import { TopicIcon } from "@/components/topic-icon";
import { categoryColor, categoryLabel } from "@/shared/utils/categories";
import { compactNumber } from "@/lib/helpers";
import { toTopicView } from "@/lib/services/topics";
import { getUserId } from "@/lib/auth";
import {
  useTopic,
  useTopicFollow,
  useToggleTopicFollow,
  useTopicLeaderboard,
  useTopicProgress,
  useUserGames,
} from "@/features/topic/hooks/useTopicDetail";
import { useStartDuel } from "@/features/duel/hooks/useDuel";
import { useCurrentPlayer } from "@/features/shell/use-current-player";

export function TopicDetailScreen() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [tab, setTab] = useState<"classement" | "progression">("classement");

  const topicQuery = useTopic(id);
  const followQuery = useTopicFollow(id);
  const { follow, unfollow } = useToggleTopicFollow(id);
  const progressQuery = useTopicProgress(id);
  const gamesQuery = useUserGames();
  const { data: rows = [] } = useTopicLeaderboard(id, "all-time", "world");
  const userId = getUserId();
  const { profile } = useCurrentPlayer();
  const startDuel = useStartDuel();

  if (!topicQuery.data) {
    return (
      <Screen>
        <Text className="text-sm text-muted-foreground">
          {topicQuery.isError ? "Sujet introuvable." : "Chargement…"}
        </Text>
      </Screen>
    );
  }

  const dto = topicQuery.data;
  const topic = toTopicView(dto);
  const questionCount = Object.values(dto.questionsCounter ?? {}).reduce(
    (sum, n) => sum + n,
    0,
  );
  const level = progressQuery.data?.level ?? 1;
  const xp = progressQuery.data?.xp ?? 0;
  const pct = Math.min(100, Math.round(((xp % 500) / 500) * 100));
  const followRecord = followQuery.data;
  const isFollowed = !!followRecord;
  const topicGames = (gamesQuery.data ?? []).filter((g) => g.topicId === id);

  return (
    <Screen>
      <Pressable onPress={() => router.back()} className="mb-3 flex-row items-center gap-1.5">
        <ArrowLeft size={18} color="#a1a1aa" />
        <Text className="text-sm text-muted-foreground">Retour</Text>
      </Pressable>

      <View className="items-center gap-3">
        <TopicIcon topic={topic} size={84} />
        <View className="items-center gap-1">
          <View className="flex-row items-center gap-1.5">
            <View
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: categoryColor(topic.category) }}
            />
            <Text className="text-xs font-semibold uppercase text-muted-foreground">
              {categoryLabel(topic.category, topic.category)}
            </Text>
          </View>
          <Text className="text-center text-2xl font-extrabold">{topic.name}</Text>
          <Text className="text-xs text-muted-foreground">
            {compactNumber(topic.followers)} joueurs
          </Text>
        </View>

        <View className="w-full gap-2">
          <Button
            label="Lancer un duel"
            disabled={startDuel.isPending}
            onPress={() =>
              startDuel.mutate({
                topicId: id,
                playerName: profile?.displayName ?? "Joueur",
                difficulty: "NORMAL",
              })
            }
          />
          <Button
            variant={isFollowed ? "secondary" : "outline"}
            label={isFollowed ? "Suivi" : "Suivre"}
            disabled={follow.isPending || unfollow.isPending}
            onPress={() =>
              isFollowed && followRecord
                ? unfollow.mutate(followRecord.followId)
                : follow.mutate()
            }
          />
        </View>
      </View>

      <View className="mt-5 gap-1.5">
        <View className="flex-row justify-between">
          <Text className="text-[11px] font-semibold uppercase text-muted-foreground">
            Progression
          </Text>
          <Text className="text-xs text-muted-foreground">{pct} %</Text>
        </View>
        <Progress value={pct} />
      </View>

      <StatStrip
        className="mt-4 border-t border-border pt-2"
        items={[
          { label: "Niveau", value: level },
          { label: "Abonnés", value: compactNumber(topic.followers) },
          { label: "Questions", value: questionCount },
        ]}
      />

      <View className="mt-6 flex-row gap-2 border-b border-border">
        {(["classement", "progression"] as const).map((value) => (
          <Pressable
            key={value}
            onPress={() => setTab(value)}
            className={`px-1 pb-2 ${
              tab === value ? "border-b-2 border-primary" : ""
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                tab === value ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {value === "classement" ? "Classement" : "Ta progression"}
            </Text>
          </Pressable>
        ))}
      </View>

      {tab === "classement" ? (
        <Card className="mt-4 gap-0 p-0">
          {rows.length === 0 ? (
            <Text className="p-4 text-sm text-muted-foreground">
              Aucun joueur classé pour l'instant.
            </Text>
          ) : (
            rows.map((row, index) => {
              const me = row.userId === userId;
              return (
                <View
                  key={row.userId}
                  className={`flex-row items-center gap-3 px-4 py-2.5 ${
                    index < rows.length - 1 ? "border-b border-border" : ""
                  } ${me ? "bg-primary/10" : ""}`}
                >
                  <Text className="w-8 text-[15px] font-bold text-muted-foreground">
                    {row.rank}
                  </Text>
                  <Avatar name={row.displayName ?? "Joueur"} size={30} />
                  <Text className="flex-1 text-sm" numberOfLines={1}>
                    {row.displayName ?? "Joueur"}
                  </Text>
                  <Text className="text-sm font-bold text-primary">
                    {row.totalXp.toLocaleString("fr-FR")}
                  </Text>
                </View>
              );
            })
          )}
        </Card>
      ) : (
        <Card className="mt-4 gap-2">
          {topicGames.length === 0 ? (
            <Text className="text-sm text-muted-foreground">
              Pas encore de duel sur ce sujet. Les duels arrivent au prochain lot.
            </Text>
          ) : (
            topicGames.map((game) => {
              const isP1 = game.player1Id === userId;
              const me = isP1 ? game.player1Score : game.player2Score;
              const them = isP1 ? game.player2Score : game.player1Score;
              return (
                <View key={game.gameId} className="flex-row justify-between">
                  <Text className="text-sm">
                    vs {isP1 ? game.player2Name : game.player1Name}
                  </Text>
                  <Text className="text-sm font-bold">
                    {me} – {them}
                  </Text>
                </View>
              );
            })
          )}
        </Card>
      )}
    </Screen>
  );
}
