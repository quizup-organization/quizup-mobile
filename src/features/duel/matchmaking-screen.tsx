import { useEffect } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  Card,
  Spinner,
  Typography,
  useThemeColor,
} from "heroui-native";
import { CountdownText } from "@/shared/components/countdown-text";
import { useTopicOverview } from "@/features/topic/hooks/useTopicDetail";
import { topicName } from "@/shared/utils/topic-name";
import { useMe } from "@/features/auth/hooks/useMe";
import {
  useCancelMatchmaking,
  useMatchmakingTicket,
  useStartMatchmaking,
} from "./hooks/useMatchmaking";
import { useStartBotRoom } from "./hooks/useRoom";

export function MatchmakingScreen() {
  const { ticketId = "" } = useLocalSearchParams<{ ticketId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const me = useMe();
  const ticketQuery = useMatchmakingTicket(ticketId);
  const cancel = useCancelMatchmaking(ticketId);
  const retry = useStartMatchmaking();
  const startBot = useStartBotRoom();
  const [background] = useThemeColor(["background"]);
  const ticket = ticketQuery.data;
  const topicQuery = useTopicOverview(ticket?.topicId ?? "");
  const topic = topicQuery.data?.topic;
  const language = me.data?.language ?? "fr";

  useEffect(() => {
    if (ticket?.status === "COMPLETED" && ticket.roomId) {
      router.replace(`/(app)/room/${ticket.roomId}`);
    }
  }, [router, ticket?.roomId, ticket?.status]);

  if (ticketQuery.isPending) {
    return (
      <View
        className="flex-1 items-center justify-center gap-3"
        style={{ backgroundColor: background }}
      >
        <Spinner />
        <Typography type="body-sm" color="muted">
          Recherche d'un adversaire…
        </Typography>
      </View>
    );
  }

  if (!ticket) {
    return (
      <View
        className="flex-1 items-center justify-center gap-4 px-6"
        style={{ backgroundColor: background }}
      >
        <Typography type="h5">Recherche introuvable</Typography>
        <Button variant="secondary" onPress={() => router.replace("/(app)")}>
          Retour à l'accueil
        </Button>
      </View>
    );
  }

  if (ticket.status === "SEARCHING") {
    const deadline = Date.parse(ticket.createdAt) + 10_000;
    return (
      <View
        className="flex-1 items-center justify-center gap-6 px-6"
        style={{ backgroundColor: background, paddingTop: insets.top }}
      >
        <Spinner size="lg" />
        <View className="items-center gap-2">
          <Typography type="h3">Recherche d'un adversaire…</Typography>
          {topic ? (
            <Typography type="body-sm" color="muted">
              {topicName(topic.names, language)}
            </Typography>
          ) : null}
          <CountdownText deadline={deadline} />
        </View>
        <Button
          variant="outline"
          isDisabled={cancel.isPending}
          onPress={() =>
            cancel.mutate(undefined, {
              onSuccess: () =>
                router.replace(`/(app)/topic/${ticket.topicId}`),
            })
          }
        >
          Annuler la recherche
        </Button>
      </View>
    );
  }

  const expired =
    ticket.status === "EXPIRED" || ticket.status === "FAILED";
  const title =
    ticket.status === "EXPIRED"
      ? "Aucun adversaire trouvé"
      : ticket.status === "FAILED"
        ? "Recherche impossible"
        : "Recherche annulée";

  return (
    <View
      className="flex-1 items-center justify-center gap-4 px-6"
      style={{ backgroundColor: background, paddingTop: insets.top }}
    >
      <Card className="w-full">
        <Card.Body className="items-center gap-3 py-10">
          <Typography type="h4">{title}</Typography>
          <Typography type="body-sm" color="muted" align="center">
            {expired
              ? "Relance une recherche, entraîne-toi contre un bot ou reviens au sujet."
              : "Tu peux revenir au sujet ou relancer une recherche."}
          </Typography>

          {expired ? (
            <>
              <Button
                className="w-full"
                isDisabled={retry.isPending}
                onPress={() => retry.mutate(ticket.topicId)}
              >
                {retry.isPending ? "Recherche…" : "Refaire une recherche"}
              </Button>
              <Button
                className="w-full"
                variant="secondary"
                isDisabled={startBot.isPending}
                onPress={() =>
                  startBot.mutate({
                    topicId: ticket.topicId,
                    difficulty: "NORMAL",
                  })
                }
              >
                S'entraîner contre un bot
              </Button>
            </>
          ) : null}

          <Button
            className="w-full"
            variant="outline"
            onPress={() => router.replace(`/(app)/topic/${ticket.topicId}`)}
          >
            Retour au sujet
          </Button>
        </Card.Body>
      </Card>
    </View>
  );
}
