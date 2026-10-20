import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import {
  Button,
  Card,
  Chip,
  PressableFeedback,
  Spinner,
  Tabs,
  Typography,
  useThemeColor,
} from "heroui-native";
import { useMe } from "@/features/auth/hooks/useMe";
import {
  useToggleTopicFollow,
  useTopicGames,
  useTopicLeaderboard,
  useTopicOverview,
} from "@/features/topic/hooks/useTopicDetail";
import { PlayModeSheet } from "@/features/duel/components/play-mode-sheet";
import { ProgressBar } from "@/shared/components/progress-bar";
import { UserAvatar } from "@/shared/components/user-avatar";
import { categoryColor, categoryLabel } from "@/shared/utils/categories";
import { masteryGradeLabel } from "@/shared/utils/mastery";
import { topicName } from "@/shared/utils/topic-name";
import { compactNumber } from "@/lib/helpers";
import type { GameHistoryOutcome, TopicOverviewView } from "@/shared/types/bff";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <View className="flex-1 items-center gap-1">
      <Typography type="body-xs" color="muted">
        {label}
      </Typography>
      <Typography type="h5">{value}</Typography>
    </View>
  );
}

const OUTCOME_LABEL: Record<GameHistoryOutcome, string> = {
  WIN: "Victoire",
  LOSS: "Défaite",
  DRAW: "Égalité",
  WAITING: "En attente",
  IN_PROGRESS: "En cours",
  CANCELLED: "Annulée",
};

export function TopicDetailScreen() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const me = useMe();
  const [tab, setTab] = useState<"classement" | "parties">("classement");
  const [playOpen, setPlayOpen] = useState(false);
  const overviewQuery = useTopicOverview(id);
  const toggleFollow = useToggleTopicFollow(id);
  const gamesQuery = useTopicGames(me.data?.userId, { topicId: id });
  const leaderboardQuery = useTopicLeaderboard(id, {
    period: "ALL_TIME",
    scope: "WORLD",
  });
  const [background] = useThemeColor(["background"]);
  const language = me.data?.language ?? "fr";

  if (overviewQuery.isPending) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: background }}
      >
        <Spinner />
      </View>
    );
  }

  if (!overviewQuery.data) {
    return (
      <View
        className="flex-1 items-center justify-center gap-4 px-6"
        style={{ backgroundColor: background }}
      >
        <Typography type="h5">Sujet introuvable</Typography>
        <Button variant="secondary" onPress={() => router.back()}>
          Retour
        </Button>
      </View>
    );
  }

  const overview: TopicOverviewView = overviewQuery.data;
  const { topic, myProgress } = overview;
  const name = topicName(topic.names, language);
  const category = topic.category
    ? categoryLabel(topic.category, topic.categoryLabel ?? undefined)
    : null;
  const heroImage = topic.bannerUrl ?? topic.imageUrl;
  const accent = topic.color ?? categoryColor(topic.category ?? "");
  const games = gamesQuery.data?.pages.flatMap((page) => page.content) ?? [];
  const leaderboard =
    leaderboardQuery.data?.pages.flatMap((page) => page.entries.content) ?? [];
  const meEntry = leaderboardQuery.data?.pages[0]?.me ?? null;

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: background }}
      contentContainerStyle={{
        paddingBottom: insets.bottom + 112,
      }}
    >
      <View className="relative overflow-hidden" style={{ backgroundColor: accent }}>
        {heroImage ? (
          <Image
            source={{ uri: heroImage }}
            style={{ position: "absolute", inset: 0 }}
            contentFit="cover"
            transition={150}
          />
        ) : null}
        <View className="absolute inset-0 bg-black/45" />
        <View
          className="relative min-h-72 justify-between px-5"
          style={{ paddingTop: insets.top + 10, paddingBottom: 22 }}
        >
          <PressableFeedback
            accessibilityRole="button"
            accessibilityLabel="Retour"
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-black/25"
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </PressableFeedback>

          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              {category ? (
                <Chip variant="soft" className="bg-white/15">
                  <Chip.Label style={{ color: "#FFFFFF" }}>
                    {category}
                  </Chip.Label>
                </Chip>
              ) : null}
              {topic.emoji ? (
                <Typography type="h5">{topic.emoji}</Typography>
              ) : null}
            </View>
            <Typography type="h1" style={{ color: "#FFFFFF" }}>
              {name}
            </Typography>
            <Typography
              type="body-sm"
              numberOfLines={2}
              style={{ color: "rgba(255,255,255,0.78)" }}
            >
              {topic.description ??
                `${compactNumber(topic.followersCount)} joueurs suivent ce sujet.`}
            </Typography>
            <View className="mt-2 flex-row gap-5">
              <View>
                <Typography type="body-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
                  Abonnés
                </Typography>
                <Typography type="body-sm" weight="semibold" style={{ color: "#FFFFFF" }}>
                  {compactNumber(topic.followersCount)}
                </Typography>
              </View>
              <View>
                <Typography type="body-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
                  Questions
                </Typography>
                <Typography type="body-sm" weight="semibold" style={{ color: "#FFFFFF" }}>
                  {topic.questionsCount}
                </Typography>
              </View>
              <View>
                <Typography type="body-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
                  Ton niveau
                </Typography>
                <Typography type="body-sm" weight="semibold" style={{ color: "#FFFFFF" }}>
                  {myProgress.level}
                </Typography>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="gap-3 px-5 pt-4">
        <View className="flex-row gap-2">
          <Button className="flex-1" onPress={() => setPlayOpen(true)}>
            Jouer
          </Button>
          <Button
            className="flex-1"
            variant={topic.followed ? "secondary" : "outline"}
            isDisabled={toggleFollow.isPending}
            onPress={() => toggleFollow.mutate(!topic.followed)}
          >
            {topic.followed ? "Suivi" : "Suivre"}
          </Button>
        </View>

        <Card className="border border-border shadow-none">
          <Card.Body className="gap-3">
            <View className="flex-row items-center justify-between">
              <Typography type="body-sm" weight="semibold">
                Progression du sujet
              </Typography>
              <Typography type="body-xs" color="muted">
                {myProgress.completionPercent}%
              </Typography>
            </View>
            <ProgressBar value={myProgress.completionPercent} />
            <Typography type="body-xs" color="muted">
              {myProgress.completedQuestions} / {myProgress.totalQuestions}{" "}
              questions répondues
            </Typography>
          </Card.Body>
        </Card>

        <Card className="border border-border shadow-none">
          <Card.Body className="flex-row gap-2">
            <Stat label="Niveau" value={myProgress.level} />
            <Stat
              label="Abonnés"
              value={compactNumber(topic.followersCount)}
            />
            <Stat label="Questions" value={topic.questionsCount} />
          </Card.Body>
        </Card>

        <Card className="border border-border shadow-none">
          <Card.Body className="gap-3">
            <View className="flex-row items-center justify-between">
              <Typography type="body-sm" weight="semibold">
                Maîtrise ·{" "}
                {myProgress.games > 0
                  ? masteryGradeLabel(myProgress.grade)
                  : "verrouillée"}
              </Typography>
              <Typography type="body-xs" color="muted">
                {myProgress.games > 0
                  ? `${myProgress.gradeProgressPercent}%`
                  : "—"}
              </Typography>
            </View>
            <ProgressBar
              value={
                myProgress.games > 0 ? myProgress.gradeProgressPercent : 0
              }
            />
            <Typography type="body-xs" color="muted">
              {myProgress.games > 0
                ? myProgress.nextGrade
                  ? `${myProgress.gradeRemainingXp.toLocaleString("fr-FR")} XP avant ${masteryGradeLabel(myProgress.nextGrade)}`
                  : "Grade maximal atteint."
                : "Joue un duel humain terminé pour débloquer les titres du sujet."}
            </Typography>
          </Card.Body>
        </Card>
      </View>

      <View className="px-5 pt-6">
        <Tabs
          value={tab}
          onValueChange={(value) =>
            setTab(value as "classement" | "parties")
          }
          variant="secondary"
        >
          <Tabs.List>
            <Tabs.Indicator />
            <Tabs.Trigger value="classement">
              <Tabs.Label>Classement</Tabs.Label>
            </Tabs.Trigger>
            <Tabs.Trigger value="parties">
              <Tabs.Label>Mes parties</Tabs.Label>
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs>
      </View>

      {tab === "classement" ? (
        <View className="mt-4 gap-2 px-5">
          {leaderboardQuery.isPending ? (
            <View className="items-center py-8">
              <Spinner size="sm" />
            </View>
          ) : leaderboard.length === 0 ? (
            <Card className="border border-border shadow-none">
              <Card.Body className="items-center gap-2 py-8">
                <Typography type="body-sm" color="muted" align="center">
                  Le classement apparaîtra après les premiers duels.
                </Typography>
              </Card.Body>
            </Card>
          ) : (
            <>
              {meEntry ? (
                <Card className="border border-accent/30 bg-accent-soft shadow-none">
                  <Card.Body className="flex-row items-center gap-3">
                    <Typography type="body-sm" weight="bold" className="w-6">
                      {meEntry.rank}
                    </Typography>
                    <UserAvatar name={meEntry.pseudonym ?? "Moi"} size="sm" />
                    <View className="min-w-0 flex-1">
                      <Typography
                        type="body-sm"
                        weight="semibold"
                        numberOfLines={1}
                      >
                        {meEntry.pseudonym ?? "Moi"}
                      </Typography>
                      <Typography type="body-xs" color="muted">
                        Ta position
                      </Typography>
                    </View>
                    <Typography type="body-sm" weight="bold">
                      {meEntry.totalXp.toLocaleString("fr-FR")}
                    </Typography>
                  </Card.Body>
                </Card>
              ) : null}
              {leaderboard.map((entry) => (
                <Card
                  key={`${entry.userId}-${entry.rank}`}
                  className="border border-border shadow-none"
                >
                  <Card.Body className="flex-row items-center gap-3">
                    <Typography type="body-sm" weight="bold" className="w-6">
                      {entry.rank}
                    </Typography>
                    <UserAvatar name={entry.pseudonym ?? "Joueur"} size="sm" />
                    <View className="min-w-0 flex-1">
                      <Typography
                        type="body-sm"
                        weight="semibold"
                        numberOfLines={1}
                      >
                        {entry.pseudonym ?? "Joueur"}
                      </Typography>
                      <Typography type="body-xs" color="muted">
                        Niveau {entry.level}
                        {entry.country ? ` · ${entry.country}` : ""}
                      </Typography>
                    </View>
                    {entry.suspended ? (
                      <Chip variant="soft" color="danger">
                        <Chip.Label>Suspendu</Chip.Label>
                      </Chip>
                    ) : null}
                    <Typography type="body-sm" weight="bold">
                      {entry.totalXp.toLocaleString("fr-FR")}
                    </Typography>
                  </Card.Body>
                </Card>
              ))}
              {leaderboardQuery.hasNextPage ? (
                <Button
                  variant="secondary"
                  isDisabled={leaderboardQuery.isFetchingNextPage}
                  onPress={() => {
                    void leaderboardQuery.fetchNextPage();
                  }}
                >
                  Afficher plus
                </Button>
              ) : null}
            </>
          )}
        </View>
      ) : (
        <View className="mt-4 gap-2 px-5">
          {gamesQuery.isPending ? (
            <View className="items-center py-8">
              <Spinner size="sm" />
            </View>
          ) : games.length === 0 ? (
            <Card className="border border-border shadow-none">
              <Card.Body className="items-center gap-2 py-8">
                <Typography type="body-sm" color="muted" align="center">
                  Aucune partie sur ce sujet pour l'instant.
                </Typography>
              </Card.Body>
            </Card>
          ) : (
            games.map((game) => (
              <Card
                key={game.gameId}
                className="border border-border shadow-none"
              >
                <Card.Body className="flex-row items-center gap-3">
                  <UserAvatar
                    name={
                      game.opponent?.pseudonym ??
                      (game.opponentType === "BOT" ? "Bot" : "Adversaire")
                    }
                    size="sm"
                  />
                  <View className="min-w-0 flex-1">
                    <Typography
                      type="body-sm"
                      weight="semibold"
                      numberOfLines={1}
                    >
                      vs{" "}
                      {game.opponent?.pseudonym ??
                        (game.opponentType === "BOT" ? "Bot" : "Adversaire")}
                    </Typography>
                    <Typography type="body-xs" color="muted">
                      {OUTCOME_LABEL[game.outcome]} ·{" "}
                      {new Date(game.playedAt).toLocaleDateString("fr-FR")}
                    </Typography>
                  </View>
                  <Typography type="body-sm" weight="bold">
                    {game.myScore} – {game.opponentScore}
                  </Typography>
                </Card.Body>
              </Card>
            ))
          )}
          {gamesQuery.hasNextPage ? (
            <Button
              variant="secondary"
              isDisabled={gamesQuery.isFetchingNextPage}
              onPress={() => {
                void gamesQuery.fetchNextPage();
              }}
            >
              Afficher plus
            </Button>
          ) : null}
        </View>
      )}

      <PlayModeSheet
        open={playOpen}
        onOpenChange={setPlayOpen}
        topicId={id}
        topicName={name}
      />
    </ScrollView>
  );
}
