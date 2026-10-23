import { useEffect, useRef } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import {
  AppAvatar,
  AppButton,
  AppCard,
  AppChip,
  AppText,
  Column,
  ProgressBar,
  Row,
  Screen,
  Section,
  Spacer,
} from "@/components";
import {
  isRoomFailure,
  ROOM_STATUS_LABELS,
  roomStatusProgress,
} from "@/features/rooms/domain/room";
import { useJoinRoom } from "@/features/rooms/hooks/use-join-room";
import { useRoom } from "@/features/rooms/hooks/use-room";
import { TopicEmoji } from "@/features/topics/components/topic-emoji";
import { topicName } from "@/features/topics/domain/topic";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";


export function RoomPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const roomId = id ?? "";
  const room = useRoom(roomId);
  const join = useJoinRoom(roomId);
  const joinStarted = useRef(false);

  useEffect(() => {
    if (joinStarted.current || !room.data) return;
    if (room.data.initiatorPresent) return;
    if (
      room.data.status !== "WAITING_PLAYERS" &&
      room.data.status !== "FETCHING_PLAYERS"
    ) {
      return;
    }

    joinStarted.current = true;
    join.mutate();
  }, [room.data, join]);

  useEffect(() => {
    if (!room.data?.gameId) return;
    if (
      room.data.status === "GAME_CREATED" ||
      room.data.status === "COMPLETED"
    ) {
      router.replace(`/games/${room.data.gameId}`);
    }
  }, [room.data?.gameId, room.data?.status, router]);

  const retryJoin = () => {
    joinStarted.current = false;
    join.mutate();
  };

  if (room.isLoading) {
    return (
      <Screen>
        <LoadingState label="Préparation de la salle…" />
      </Screen>
    );
  }

  if (room.isError || !room.data) {
    return (
      <Screen>
        <ErrorState
          message="Impossible de charger cette salle."
          onRetry={() => void room.refetch()}
        />
      </Screen>
    );
  }

  const data = room.data;
  const name = topicName(data.topic.names, "fr", data.topic.topicId);
  const opponentName =
    data.opponent?.pseudonym ?? (data.vsBot ? "Bot" : "Adversaire");
  const failed = isRoomFailure(data.status);
  const terminal = failed || data.status === "COMPLETED";
  const progress = roomStatusProgress(data.status);

  return (
    <>
      <Stack.Screen options={{ title: "Salon" }} />
      <Screen
        refreshing={room.isRefetching}
        onRefresh={() => void room.refetch()}
      >
        <Section>
          <AppCard>
            <Row spacing={14} alignment="center">
              <TopicEmoji
                emoji={data.topic.emoji}
                color={data.topic.color}
                imageUrl={data.topic.imageUrl}
                size={48}
              />
              <Column spacing={2}>
                <AppText variant="title" numberOfLines={1}>
                  {name}
                </AppText>
                <AppText variant="caption" tone="muted">
                  {data.vsBot ? "Duel contre le bot" : "Duel entre joueurs"}
                </AppText>
              </Column>
              <Spacer flexible />
              {data.vsBot ? <AppChip label="Bot" selected /> : null}
            </Row>

            <Row spacing={12} alignment="center">
              <AppAvatar
                name={opponentName}
                userId={data.opponent?.userId}
                avatarOptions={data.opponent?.avatarOptions}
                size={38}
              />
              <Column spacing={2}>
                <AppText variant="label">{opponentName}</AppText>
                <AppText variant="caption" tone="muted">
                  {data.opponent?.pseudonym
                    ? "Adversaire"
                    : "Adversaire automatique"}
                </AppText>
              </Column>
            </Row>
          </AppCard>
        </Section>

        <Section title="Préparation">
          <AppCard>
            <AppText variant="heading">
              {ROOM_STATUS_LABELS[data.status]}
            </AppText>
            <ProgressBar
              value={progress}
              label="Progression de la préparation"
            />
            <AppText variant="caption" tone="muted">
              {terminal
                ? "Cette salle a terminé son cycle de vie."
                : "La partie démarre dès que les deux joueurs sont prêts."}
            </AppText>
            {join.isError ? (
              <Column spacing={8}>
                <AppText variant="caption" tone="danger">
                  Impossible de rejoindre la salle.
                </AppText>
                <AppButton
                  label="Réessayer"
                  variant="outlined"
                  onPress={retryJoin}
                  disabled={join.isPending}
                />
              </Column>
            ) : null}
          </AppCard>
        </Section>

        {terminal ? (
          <AppButton
            label="Retour au sujet"
            variant="outlined"
            onPress={() =>
              router.replace(`/topics/${data.topic.topicId}`)
            }
          />
        ) : null}
      </Screen>
    </>
  );
}
