import { useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import {
  AppAvatar,
  AppButton,
  AppCard,
  AppChip,
  AppText,
  AppTextField,
  Column,
  Row,
  Screen,
  Section,
  Spacer,
} from "@/components";
import { useCreateChallenge } from "@/features/challenges/hooks/use-create-challenge";
import { usePeople } from "@/features/player/hooks/use-people";
import { usePlayerSearch } from "@/features/player/hooks/use-player-search";
import { useMe } from "@/features/profile/hooks/use-me";
import { useTopicOverview } from "@/features/topic/hooks/use-topic-overview";
import { topicName } from "@/features/topics/domain/topic";
import { useContentWidth } from "@/hooks/use-content-width";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { formatNumber } from "@/shared/utils/format";

export function ChallengeOpponentPage() {
  const router = useRouter();
  const width = useContentWidth();
  const { topicId: topicParam } = useLocalSearchParams<{ topicId: string }>();
  const topicId = topicParam ?? "";
  const me = useMe();
  const topic = useTopicOverview(topicId);
  const [query, setQuery] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const following = usePeople(me.data?.userId, "following", {
    page: 0,
    size: 50,
  });
  const search = usePlayerSearch(query);
  const create = useCreateChallenge();
  const searching = query.trim().length >= 2;
  const candidates = searching
    ? (search.data?.content ?? [])
    : (following.data?.content ?? []);
  const language = me.data?.language ?? "fr";

  if (me.isLoading || topic.isLoading || following.isLoading) {
    return (
      <Screen>
        <LoadingState label="Chargement des joueurs…" />
      </Screen>
    );
  }

  if (me.isError || topic.isError || !topic.data) {
    return (
      <Screen>
        <ErrorState
          message="Impossible de préparer le défi."
          onRetry={() => {
            void me.refetch();
            void topic.refetch();
            void following.refetch();
          }}
        />
      </Screen>
    );
  }

  if (sentTo) {
    return (
      <>
        <Stack.Screen options={{ title: "Défi envoyé" }} />
        <Screen>
          <Column spacing={10} alignment="center">
            <AppChip label="Défi envoyé" selected />
            <AppText variant="title" align="center">
              {`Défi envoyé à ${sentTo}`}
            </AppText>
            <AppText variant="body" tone="muted" align="center">
              Ton adversaire a une heure pour accepter. Tu peux suivre la
              réponse dans l'onglet Défis.
            </AppText>
          </Column>
          <AppButton
            label="Voir mes défis"
            onPress={() => router.replace("/challenges")}
          />
          <AppButton
            label="Retour au sujet"
            variant="outlined"
            onPress={() => router.replace(`/topics/${topicId}`)}
          />
        </Screen>
      </>
    );
  }

  const name = topicName(topic.data.topic.names, language, topicId);

  return (
    <>
      <Stack.Screen options={{ title: "Défier un joueur" }} />
      <Screen>
        <AppCard>
          <Row spacing={12} alignment="center">
            <AppText variant="heading">{topic.data.topic.emoji ?? "🎯"}</AppText>
            <Column spacing={2}>
              <AppText variant="label">{name}</AppText>
              <AppText variant="caption" tone="muted">
                Choisis un adversaire dans tes abonnements
              </AppText>
            </Column>
          </Row>
        </AppCard>

        <AppTextField
          defaultValue={query}
          placeholder="Rechercher un joueur"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setQuery}
          style={{ width }}
        />

        <Section
          title={searching ? "Résultats" : "Tes abonnements"}
          action={`${candidates.length}`}
        >
          {searching && search.isLoading ? (
            <AppText variant="caption" tone="muted">
              Recherche…
            </AppText>
          ) : candidates.length === 0 ? (
            <EmptyState
              title={searching ? "Aucun joueur trouvé" : "Aucun abonnement"}
              subtitle={
                searching
                  ? "Essaie un autre pseudonyme."
                  : "Suis des joueurs depuis l'onglet Social pour les défier."
              }
            />
          ) : (
            <Column spacing={8}>
              {candidates
                .filter((player) => player.userId !== me.data?.userId)
                .map((player) => (
                  <AppCard
                    key={player.userId}
                    onPress={() => {
                      if (create.isPending) return;
                      create.mutate(
                        {
                          topicId,
                          opponentId: player.userId,
                        },
                        {
                          onSuccess: () =>
                            setSentTo(player.pseudonym ?? "ce joueur"),
                        },
                      );
                    }}
                    accessibilityLabel={`Défier ${player.pseudonym ?? "ce joueur"}`}
                  >
                    <Row spacing={12} alignment="center">
                      <AppAvatar
                        name={player.pseudonym ?? "Joueur"}
                        userId={player.userId}
                        avatarOptions={player.avatarOptions}
                        size={42}
                      />
                      <Column spacing={2}>
                        <AppText variant="label">
                          {player.pseudonym ?? "Joueur"}
                        </AppText>
                        <AppText variant="caption" tone="muted">
                          {player.provisional
                            ? "Elo provisoire"
                            : `Elo ${formatNumber(player.rating)}`}
                        </AppText>
                      </Column>
                      <Spacer flexible />
                      <AppChip
                        label={create.isPending ? "Envoi…" : "Défier"}
                        selected
                      />
                    </Row>
                  </AppCard>
                ))}
            </Column>
          )}
        </Section>

        {create.isError ? (
          <AppText variant="caption" tone="danger" align="center">
            Impossible d'envoyer le défi. Réessaie.
          </AppText>
        ) : null}
      </Screen>
    </>
  );
}
