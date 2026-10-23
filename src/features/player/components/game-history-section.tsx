import { AppAvatar, AppCard, AppText, Column, Row, Spacer } from "@/components";
import { TopicEmoji } from "@/features/topics/components/topic-emoji";
import { topicName } from "@/features/topics/domain/topic";
import { useProfileGames } from "@/features/player/hooks/use-profile-games";
import { Section } from "@/components";
import { EmptyState } from "@/shared/components/empty-state";
import { formatNumber } from "@/shared/utils/format";

const OUTCOME_LABELS: Record<string, string> = {
  WIN: "Victoire",
  LOSS: "Défaite",
  DRAW: "Match nul",
  WAITING: "En attente",
  IN_PROGRESS: "En cours",
  CANCELLED: "Annulée",
};

export function GameHistorySection({
  userId,
  language = "fr",
  title = "Derniers duels",
  limit = 5,
}: {
  userId: string;
  language?: "fr" | "en";
  title?: string;
  limit?: number;
}) {
  const games = useProfileGames(userId, { page: 0, size: limit });

  return (
    <Section title={title}>
      {games.isLoading ? (
        <AppText variant="caption" tone="muted">
          Chargement de l'historique…
        </AppText>
      ) : (games.data?.content.length ?? 0) === 0 ? (
        <EmptyState
          title="Aucun duel joué"
          subtitle="Ton historique apparaîtra après ta première partie."
        />
      ) : (
        <Column spacing={8}>
          {games.data!.content.map((game) => (
            <AppCard key={game.gameId}>
              <Row spacing={12} alignment="center">
                <TopicEmoji
                  emoji={game.topic.emoji}
                  color={game.topic.color}
                  imageUrl={game.topic.imageUrl}
                  size={38}
                />
                <Column spacing={2}>
                  <AppText variant="label" numberOfLines={1}>
                    {topicName(game.topic.names, language, game.topic.topicId)}
                  </AppText>
                  <Row spacing={8} alignment="center">
                    <AppAvatar
                      name={game.opponent?.pseudonym ?? "Bot"}
                      userId={game.opponent?.userId}
                      avatarOptions={game.opponent?.avatarOptions}
                      size={22}
                    />
                    <AppText variant="caption" tone="muted">
                      {game.opponent?.pseudonym ?? "Bot"}
                    </AppText>
                    <AppText variant="caption" tone="muted">
                      {new Date(game.playedAt).toLocaleDateString("fr-FR")}
                    </AppText>
                  </Row>
                </Column>
                <Spacer flexible />
                <Column spacing={2} alignment="end">
                  <AppText
                    variant="caption"
                    tone={
                      game.outcome === "WIN"
                        ? "accent"
                        : game.outcome === "LOSS"
                          ? "danger"
                          : "muted"
                    }
                  >
                    {OUTCOME_LABELS[game.outcome] ?? game.outcome}
                  </AppText>
                  <AppText variant="label">
                    {`${game.myScore} – ${game.opponentScore}`}
                  </AppText>
                  {game.xp != null ? (
                    <AppText variant="caption" tone="muted">
                      {`+${formatNumber(game.xp)} XP`}
                    </AppText>
                  ) : null}
                </Column>
              </Row>
            </AppCard>
          ))}
        </Column>
      )}
    </Section>
  );
}
