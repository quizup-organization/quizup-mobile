import {
  AppAvatar,
  AppButton,
  AppCard,
  AppText,
  Column,
  Row,
  Screen,
  Section,
  Spacer,
} from "@/components";
import type {
  PendingChallenge,
  RoomSummary,
} from "@/features/challenges/domain/challenge";
import {
  useChallenges,
  useRespondChallenge,
} from "@/features/challenges/hooks/use-challenges";
import { TopicEmoji } from "@/features/topics/components/topic-emoji";
import { topicName } from "@/features/topics/domain/topic";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { initials } from "@/shared/utils/format";

function expiryLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ChallengeCard({
  challenge,
  onRespond,
  pending,
}: {
  challenge: PendingChallenge;
  onRespond: (accept: boolean) => void;
  pending: boolean;
}) {
  const opponent = challenge.opponent.pseudonym ?? "Joueur";
  const name = topicName(challenge.topic.names, "fr", challenge.topic.topicId);

  return (
    <AppCard>
      <Row spacing={12} alignment="center">
        <TopicEmoji
          emoji={challenge.topic.emoji}
          color={challenge.topic.color}
          size={40}
        />
        <Column spacing={2}>
          <AppText variant="label" numberOfLines={1}>
            {name}
          </AppText>
          <AppText variant="caption" tone="muted">
            {`Défi de ${opponent} · jusqu'à ${expiryLabel(challenge.expiresAt)}`}
          </AppText>
        </Column>
      </Row>
      <Row spacing={8} alignment="center">
        <AppButton
          label="Accepter"
          disabled={pending}
          onPress={() => onRespond(true)}
        />
        <AppButton
          variant="text"
          label="Refuser"
          disabled={pending}
          onPress={() => onRespond(false)}
        />
        <Spacer flexible />
      </Row>
    </AppCard>
  );
}

function SentChallengeCard({ challenge }: { challenge: PendingChallenge }) {
  const opponent = challenge.opponent.pseudonym ?? "Joueur";
  const name = topicName(challenge.topic.names, "fr", challenge.topic.topicId);

  return (
    <AppCard>
      <Row spacing={12} alignment="center">
        <AppAvatar initials={initials(opponent)} size={40} />
        <Column spacing={2}>
          <AppText variant="label" numberOfLines={1}>
            {name}
          </AppText>
          <AppText variant="caption" tone="muted">
            {`En attente de ${opponent} · jusqu'à ${expiryLabel(challenge.expiresAt)}`}
          </AppText>
        </Column>
      </Row>
    </AppCard>
  );
}

function RoomCard({ room }: { room: RoomSummary }) {
  const opponent = room.opponent?.pseudonym ?? "Bot";
  const name = topicName(room.topic.names, "fr", room.topic.topicId);

  return (
    <AppCard>
      <Row spacing={12} alignment="center">
        <TopicEmoji
          emoji={room.topic.emoji}
          color={room.topic.color}
          size={40}
        />
        <Column spacing={2}>
          <AppText variant="label" numberOfLines={1}>
            {name}
          </AppText>
          <AppText variant="caption" tone="muted">
            {`${opponent} · ${room.status === "WAITING_PLAYERS" ? "En attente" : room.status}`}
          </AppText>
        </Column>
      </Row>
    </AppCard>
  );
}

export function ChallengesPage() {
  const challenges = useChallenges();
  const respond = useRespondChallenge();

  const refetch = () => void challenges.refetch();

  if (challenges.isLoading) {
    return (
      <Screen tabBar>
        <LoadingState label="Chargement des défis…" />
      </Screen>
    );
  }

  if (challenges.isError || !challenges.data) {
    return (
      <Screen tabBar>
        <ErrorState
          message="Impossible de charger les défis."
          onRetry={refetch}
        />
      </Screen>
    );
  }

  const { received, sent, rooms } = challenges.data;

  return (
    <Screen
      tabBar
      refreshing={challenges.isRefetching}
      onRefresh={refetch}
    >
      <Section title="Reçus" action={`${received.length}`}>
        {received.length === 0 ? (
          <EmptyState
            title="Aucun défi reçu"
            subtitle="Tes amis peuvent te défier depuis un sujet."
          />
        ) : (
          <Column spacing={10}>
            {received.map((challenge) => (
              <ChallengeCard
                key={challenge.challengeId}
                challenge={challenge}
                pending={respond.isPending}
                onRespond={(accept) =>
                  respond.mutate({
                    challengeId: challenge.challengeId,
                    accept,
                  })
                }
              />
            ))}
          </Column>
        )}
      </Section>

      <Section title="Envoyés" action={`${sent.length}`}>
        {sent.length === 0 ? (
          <EmptyState title="Aucun défi envoyé" />
        ) : (
          <Column spacing={10}>
            {sent.map((challenge) => (
              <SentChallengeCard
                key={challenge.challengeId}
                challenge={challenge}
              />
            ))}
          </Column>
        )}
      </Section>

      <Section title="Salons" action={`${rooms.length}`}>
        {rooms.length === 0 ? (
          <EmptyState
            title="Aucun salon en attente"
            subtitle="Crée une salle depuis un sujet pour jouer."
          />
        ) : (
          <Column spacing={10}>
            {rooms.map((room) => (
              <RoomCard key={room.roomId} room={room} />
            ))}
          </Column>
        )}
      </Section>
    </Screen>
  );
}
