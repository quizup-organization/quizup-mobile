import { useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import {
  AppButton,
  AppCard,
  AppChip,
  AppIconTile,
  AppImage,
  AppText,
  Carousel,
  Column,
  Row,
  Screen,
  Section,
  Spacer,
} from "@/components";
import { useCreateBotRoom } from "@/features/rooms/hooks/use-create-bot-room";
import { useCreateSharedRoom } from "@/features/rooms/hooks/use-create-shared-room";
import { useStartMatchmaking } from "@/features/matchmaking/hooks/use-matchmaking";
import { TopicEmoji } from "@/features/topics/components/topic-emoji";
import { topicName } from "@/features/topics/domain/topic";
import { useTopicOverview } from "@/features/topic/hooks/use-topic-overview";
import { useMe } from "@/features/profile/hooks/use-me";
import { useContentWidth } from "@/hooks/use-content-width";
import { isMockData } from "@/lib/config";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";

const DIFFICULTIES = [
  { id: "EASY" as const, label: "Facile" },
  { id: "NORMAL" as const, label: "Normal" },
  { id: "HARD" as const, label: "Difficile" },
];

export function PlayModePage() {
  const router = useRouter();
  const width = useContentWidth();
  const { topicId: topicParam } = useLocalSearchParams<{ topicId: string }>();
  const topicId = topicParam ?? "";
  const topic = useTopicOverview(topicId);
  const me = useMe();
  const createBot = useCreateBotRoom();
  const createRoom = useCreateSharedRoom();
  const startMatchmaking = useStartMatchmaking();
  const [difficulty, setDifficulty] = useState<"EASY" | "NORMAL" | "HARD">(
    "NORMAL",
  );

  const busy =
    createBot.isPending || createRoom.isPending || startMatchmaking.isPending;

  if (topic.isLoading || me.isLoading) {
    return (
      <Screen>
        <LoadingState label="Chargement des modes de jeu…" />
      </Screen>
    );
  }

  if (topic.isError || !topic.data) {
    return (
      <Screen>
        <ErrorState
          message="Impossible de charger ce sujet."
          onRetry={() => void topic.refetch()}
        />
      </Screen>
    );
  }

  const data = topic.data;
  const language = me.data?.language ?? "fr";
  const name = topicName(data.topic.names, language, data.topic.topicId);

  return (
    <>
      <Stack.Screen options={{ title: "Jouer" }} />
      <Screen>
        <AppCard padding={0} spacing={0}>
          {data.topic.bannerUrl ? (
            <AppImage
              source={{ uri: data.topic.bannerUrl }}
              width={width}
              height={150}
              radius={18}
              accessibilityLabel={`Bannière de ${name}`}
            />
          ) : null}
          <Row spacing={12} alignment="center" style={{ padding: 16 }}>
            <TopicEmoji
              emoji={data.topic.emoji}
              color={data.topic.color}
              imageUrl={data.topic.imageUrl}
              size={48}
            />
            <Column spacing={2}>
              <AppText variant="title" numberOfLines={2}>
                {name}
              </AppText>
              <AppText variant="caption" tone="muted">
                Choisis ton mode de duel
              </AppText>
            </Column>
          </Row>
        </AppCard>

        <Section title="Duel bot">
          <AppCard>
            <Row spacing={12} alignment="center">
              <AppIconTile name="game" size={42} />
              <Column spacing={2}>
                <AppText variant="label">S'entraîner</AppText>
                <AppText variant="caption" tone="muted">
                  Une partie immédiate, sans attendre d'adversaire.
                </AppText>
              </Column>
            </Row>
            <Carousel
              items={DIFFICULTIES}
              renderItem={(item) => (
                <AppChip
                  label={item.label}
                  selected={difficulty === item.id}
                  onPress={() => setDifficulty(item.id)}
                />
              )}
            />
            <AppButton
              label={createBot.isPending ? "Préparation…" : "Lancer le duel bot"}
              disabled={busy || isMockData}
              onPress={() =>
                createBot.mutate(
                  { topicId, difficulty },
                  {
                    onSuccess: (room) => router.push(`/rooms/${room.id}`),
                  },
                )
              }
            />
          </AppCard>
        </Section>

        <Section title="Duel public">
          <AppCard>
            <Row spacing={12} alignment="center">
              <AppIconTile name="topics" size={42} />
              <Column spacing={2}>
                <AppText variant="label">Défier le monde</AppText>
                <AppText variant="caption" tone="muted">
                  Recherche un adversaire de niveau proche.
                </AppText>
              </Column>
            </Row>
            <AppButton
              label={
                startMatchmaking.isPending
                  ? "Recherche…"
                  : "Chercher un adversaire"
              }
              disabled={busy || isMockData}
              onPress={() =>
                startMatchmaking.mutate(topicId, {
                  onSuccess: (ticket) =>
                    router.push(`/matchmaking/${ticket.ticketId}`),
                })
              }
            />
          </AppCard>
        </Section>

        <Section title="Entre joueurs">
          <AppCard>
            <Row spacing={12} alignment="center">
              <AppIconTile name="social" size={42} />
              <Column spacing={2}>
                <AppText variant="label">Défier un joueur</AppText>
                <AppText variant="caption" tone="muted">
                  Envoie une invitation nominative à un joueur que tu suis.
                </AppText>
              </Column>
            </Row>
            <AppButton
              label="Choisir un adversaire"
              variant="outlined"
              disabled={busy}
              onPress={() => router.push(`/challenge/${topicId}`)}
            />
          </AppCard>

          <AppCard>
            <Row spacing={12} alignment="center">
              <AppIconTile name="social" size={42} />
              <Column spacing={2}>
                <AppText variant="label">Salle partagée</AppText>
                <AppText variant="caption" tone="muted">
                  Crée une salle et envoie le lien à un ami.
                </AppText>
              </Column>
            </Row>
            <AppButton
              label={
                createRoom.isPending ? "Création…" : "Créer une salle partagée"
              }
              variant="outlined"
              disabled={busy || isMockData}
              onPress={() =>
                createRoom.mutate(topicId, {
                  onSuccess: (room) => router.push(`/rooms/${room.id}`),
                })
              }
            />
          </AppCard>
        </Section>

        {isMockData ? (
          <AppText variant="caption" tone="muted" align="center">
            Les duels sont disponibles en mode connecté.
          </AppText>
        ) : null}
        {createBot.isError ||
        createRoom.isError ||
        startMatchmaking.isError ? (
          <AppText variant="caption" tone="danger" align="center">
            Impossible de lancer ce mode. Réessaie.
          </AppText>
        ) : null}
        <Spacer />
      </Screen>
    </>
  );
}
