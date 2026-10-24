import { useEffect, useRef, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import {
  AppButton,
  AppCard,
  AppIconTile,
  AppText,
  Column,
  ProgressBar,
  Row,
  Screen,
  Section,
  Spacer,
} from "@/components";
import { useCreateBotRoom } from "@/features/rooms/hooks/use-create-bot-room";
import {
  useCancelMatchmaking,
  useMatchmakingTicket,
  useStartMatchmaking,
} from "@/features/matchmaking/hooks/use-matchmaking";
import { TopicEmoji } from "@/features/topics/components/topic-emoji";
import { topicName } from "@/features/topics/domain/topic";
import { useTopicOverview } from "@/features/topic/hooks/use-topic-overview";
import { useMe } from "@/features/profile/hooks/use-me";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";

const SEARCH_WINDOW_MS = 30_000;

export function MatchmakingPage() {
  const router = useRouter();
  const { ticketId = "" } = useLocalSearchParams<{ ticketId: string }>();
  const ticket = useMatchmakingTicket(ticketId);
  const cancel = useCancelMatchmaking(ticketId);
  const start = useStartMatchmaking();
  const createBot = useCreateBotRoom();
  const topic = useTopicOverview(ticket.data?.topicId ?? "");
  const me = useMe();
  const [now, setNow] = useState(() => Date.now());
  const statusRef = useRef(ticket.data?.status);
  statusRef.current = ticket.data?.status;

  useEffect(() => {
    if (ticket.data?.status !== "SEARCHING") return;
    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(interval);
  }, [ticket.data?.status]);

  useEffect(
    () => () => {
      if (statusRef.current === "SEARCHING") {
        void cancel.mutateAsync().catch(() => undefined);
      }
    },
    // La mutation est stable pour la durée du ticket.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (
      ticket.data?.status === "COMPLETED" &&
      ticket.data.roomId
    ) {
      router.replace(`/rooms/${ticket.data.roomId}`);
    }
  }, [ticket.data?.roomId, ticket.data?.status, router]);

  if (ticket.isLoading) {
    return (
      <Screen>
        <LoadingState label="Recherche d'un adversaire…" />
      </Screen>
    );
  }

  if (ticket.isError || !ticket.data) {
    return (
      <Screen>
        <ErrorState
          message="Impossible de suivre la recherche."
          onRetry={() => void ticket.refetch()}
        />
      </Screen>
    );
  }

  const data = ticket.data;
  const language = me.data?.language ?? "fr";
  const topicData = topic.data?.topic;
  const name = topicData
    ? topicName(topicData.names, language, topicData.topicId)
    : "Sujet";
  const deadline = Date.parse(data.createdAt) + SEARCH_WINDOW_MS;
  const remaining = Math.max(0, deadline - now);
  const ratio = Math.min(1, remaining / SEARCH_WINDOW_MS);

  if (data.status === "CANCELLED" || data.status === "FAILED") {
    return (
      <Screen>
        <ErrorState
          message={
            data.status === "FAILED"
              ? "La recherche a échoué."
              : "La recherche a été annulée."
          }
        />
        <AppButton
          label="Retour au sujet"
          variant="outlined"
          onPress={() => router.replace(`/topics/${data.topicId}`)}
        />
      </Screen>
    );
  }

  if (data.status === "EXPIRED") {
    return (
      <>
        <Stack.Screen options={{ title: "Aucun adversaire" }} />
        <Screen>
          <Column spacing={8} alignment="center">
            <AppIconTile name="clock" size={64} />
            <AppText variant="title" align="center">
              Aucun adversaire trouvé
            </AppText>
            <AppText variant="body" tone="muted" align="center">
              {`Personne n'était disponible sur ${name}. Tu peux relancer ou t'entraîner contre un bot.`}
            </AppText>
          </Column>
          <Column spacing={8}>
            <AppButton
              label={start.isPending ? "Recherche…" : "Relancer la recherche"}
              disabled={start.isPending}
              onPress={() =>
                start.mutate(data.topicId, {
                  onSuccess: (next) =>
                    router.replace(`/matchmaking/${next.ticketId}`),
                })
              }
            />
            <AppButton
              label={
                createBot.isPending
                  ? "Préparation…"
                  : "S'entraîner contre un bot"
              }
              variant="outlined"
              disabled={createBot.isPending}
              onPress={() =>
                createBot.mutate(
                  { topicId: data.topicId, difficulty: "NORMAL" },
                  {
                    onSuccess: (room) =>
                      router.replace(`/rooms/${room.id}`),
                  },
                )
              }
            />
            <AppButton
              label="Retour au sujet"
              variant="text"
              onPress={() => router.replace(`/topics/${data.topicId}`)}
            />
          </Column>
        </Screen>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Recherche" }} />
      <Screen>
        <Section>
          <AppCard>
            <Row spacing={14} alignment="center">
              <TopicEmoji
                emoji={topicData?.emoji ?? null}
                color={topicData?.color ?? null}
                imageUrl={topicData?.imageUrl}
                size={52}
              />
              <Column spacing={2}>
                <AppText variant="title" numberOfLines={1}>
                  {name}
                </AppText>
                <AppText variant="caption" tone="muted">
                  Recherche d'un adversaire de niveau proche
                </AppText>
              </Column>
              <Spacer flexible />
              <AppIconTile name="search" size={38} />
            </Row>
            <ProgressBar value={ratio} label="Temps de recherche restant" />
            <AppText variant="caption" tone="muted" align="center">
              {`${Math.ceil(remaining / 1000)} s restantes`}
            </AppText>
          </AppCard>
        </Section>

        <AppText variant="body" tone="muted" align="center">
          Nous cherchons un joueur disponible. Tu peux annuler à tout moment.
        </AppText>

        <AppButton
          label={cancel.isPending ? "Annulation…" : "Annuler la recherche"}
          variant="outlined"
          disabled={cancel.isPending}
          onPress={() =>
            cancel.mutate(undefined, {
              onSuccess: () => router.back(),
            })
          }
        />
      </Screen>
    </>
  );
}
