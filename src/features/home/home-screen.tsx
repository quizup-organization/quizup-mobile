import { ScrollView, RefreshControl, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  Card,
  Spinner,
  Typography,
  useThemeColor,
} from "heroui-native";
import { useHome } from "@/features/home/hooks/useHome";
import { useMe } from "@/features/auth/hooks/useMe";
import { useActiveGames } from "@/features/duel/hooks/useActiveGames";
import { TopicCard } from "@/features/topics/components/topic-card";
import { topicName } from "@/shared/utils/topic-name";
import type { Language, TopicCardView } from "@/shared/types/bff";

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between gap-3">
        <Typography type="h4">{title}</Typography>
        {action}
      </View>
      {children}
    </View>
  );
}

function Rail({
  topics,
  language,
  onOpen,
  variant = "landscape",
  width = 280,
  ranked = false,
}: {
  topics: TopicCardView[];
  language: Language;
  onOpen: (id: string) => void;
  variant?: "poster" | "landscape";
  width?: number;
  ranked?: boolean;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 12, paddingBottom: 4 }}
    >
      {topics.map((topic, index) => (
        <TopicCard
          key={topic.topicId}
          topic={topic}
          language={language}
          variant={variant}
          width={width}
          rank={ranked ? index + 1 : undefined}
          onPress={() => onOpen(topic.topicId)}
        />
      ))}
    </ScrollView>
  );
}

function ResumeBanner({
  game,
  language,
  onOpen,
}: {
  game: NonNullable<ReturnType<typeof useActiveGames>["data"]>[number];
  language: Language;
  onOpen: () => void;
}) {
  const opponent =
    game.opponent?.pseudonym ??
    (game.opponentType === "BOT" ? "Bot" : "Adversaire");

  return (
    <Card className="border-danger/25 bg-danger-soft shadow-none">
      <Card.Body className="flex-row items-center gap-3 py-3">
        <View className="relative h-9 w-9 items-center justify-center rounded-xl bg-danger/15">
          <View className="h-2.5 w-2.5 rounded-full bg-danger" />
        </View>
        <View className="min-w-0 flex-1 gap-0.5">
          <View className="flex-row items-center gap-1.5">
            <View className="h-1.5 w-1.5 rounded-full bg-danger" />
            <Typography type="body-xs" weight="semibold" className="text-danger">
              Partie en cours
            </Typography>
          </View>
          <Typography type="body-sm" weight="semibold" numberOfLines={1}>
            {topicName(game.topic.names, language)}
          </Typography>
          <Typography type="body-xs" color="muted" numberOfLines={1}>
            Contre {opponent}
          </Typography>
        </View>
        <Button size="sm" onPress={onOpen}>
          Reprendre
        </Button>
      </Card.Body>
    </Card>
  );
}

export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const home = useHome();
  const me = useMe();
  const activeGames = useActiveGames();
  const language = me.data?.language ?? "fr";
  const [accent, background] = useThemeColor(["accent", "background"]);
  const activeGame = activeGames.data?.[0] ?? null;

  const openTopic = (topicId: string) => router.push(`/(app)/topic/${topicId}`);

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: background }}
      contentContainerStyle={{
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom + 112,
        paddingHorizontal: 20,
        gap: 26,
      }}
      refreshControl={
        <RefreshControl
          refreshing={home.isRefetching}
          onRefresh={() => {
            void home.refetch();
          }}
          tintColor={accent}
          colors={[accent]}
        />
      }
    >
      <View className="gap-1">
        <Typography type="body-xs" color="muted" className="uppercase tracking-widest">
          QuizUp
        </Typography>
        <Typography type="h1">
          {me.data?.pseudonym ? `Salut, ${me.data.pseudonym}` : "Prêt à jouer ?"}
        </Typography>
        <Typography type="body-sm" color="muted">
          Choisis un sujet, lance un duel, garde le rythme.
        </Typography>
      </View>

      {activeGame ? (
        <ResumeBanner
          game={activeGame}
          language={language}
          onOpen={() => router.push(`/(app)/duel/${activeGame.gameId}`)}
        />
      ) : null}

      {home.isPending ? (
        <View className="items-center py-14">
          <Spinner />
        </View>
      ) : !home.data ? (
        <Card className="border border-border shadow-none">
          <Card.Body className="items-start gap-3">
            <Typography type="h5">Impossible de charger l'accueil</Typography>
            <Typography type="body-sm" color="muted">
              Vérifie ta connexion puis réessaie.
            </Typography>
            <Button
              variant="secondary"
              onPress={() => {
                void home.refetch();
              }}
            >
              Réessayer
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          {(home.data.trendingTopics ?? []).length > 0 ? (
            <Section
              title="Top 10"
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => router.push("/(app)/topics")}
                >
                  Voir tout
                </Button>
              }
            >
              <Rail
                topics={home.data.trendingTopics}
                language={language}
                onOpen={openTopic}
                variant="poster"
                width={152}
                ranked
              />
            </Section>
          ) : null}

          {(home.data.followedTopics ?? []).length > 0 ? (
            <Section
              title="Tes sujets suivis"
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => router.push("/(app)/topics")}
                >
                  Voir tout
                </Button>
              }
            >
              <Rail
                topics={home.data.followedTopics}
                language={language}
                onOpen={openTopic}
              />
            </Section>
          ) : null}

          <Section
            title="Nouveaux thèmes"
            action={
              <Button
                variant="ghost"
                size="sm"
                onPress={() => router.push("/(app)/topics")}
              >
                Voir tout
              </Button>
            }
          >
            {(home.data.newTopics ?? []).length > 0 ? (
              <Rail
                topics={home.data.newTopics}
                language={language}
                onOpen={openTopic}
              />
            ) : (
              <Typography type="body-sm" color="muted">
                Aucun nouveau thème pour l'instant.
              </Typography>
            )}
          </Section>
        </>
      )}
    </ScrollView>
  );
}
