import {
  AppCard,
  AppText,
  Column,
  ProgressBar,
  Row,
  Section,
  Spacer,
} from "@/components";
import { TopicEmoji } from "@/features/topics/components/topic-emoji";
import { topicName } from "@/features/topics/domain/topic";
import { useTopicStats } from "@/features/player/hooks/use-topic-stats";
import { EmptyState } from "@/shared/components/empty-state";
import { formatNumber } from "@/shared/utils/format";

export function TopicStatsSection({
  userId,
  language = "fr",
}: {
  userId: string;
  language?: "fr" | "en";
}) {
  const stats = useTopicStats(userId);

  if (stats.isLoading) {
    return (
      <Section title="Sujets joués">
        <AppText variant="caption" tone="muted">
          Chargement des sujets…
        </AppText>
      </Section>
    );
  }

  const items = [...(stats.data ?? [])]
    .filter((item) => item.games > 0)
    .sort((left, right) => right.xp - left.xp)
    .slice(0, 4);
  const maxXp = Math.max(1, ...items.map((item) => item.xp));

  return (
    <Section title="Sujets joués">
      {items.length === 0 ? (
        <EmptyState
          title="Aucun sujet joué"
          subtitle="Lance un duel pour commencer ta collection."
        />
      ) : (
        <Column spacing={8}>
          {items.map((item) => (
            <AppCard key={item.topicId}>
              <Row spacing={12} alignment="center">
                <TopicEmoji
                  emoji={item.emoji}
                  color={item.color}
                  imageUrl={item.imageUrl}
                  size={38}
                />
                <Column spacing={4}>
                  <Row spacing={8} alignment="center">
                    <AppText variant="label" numberOfLines={1}>
                      {topicName(item.names, language, item.topicId)}
                    </AppText>
                    <Spacer flexible />
                    <AppText variant="caption" tone="muted">
                      {`${formatNumber(item.xp)} XP`}
                    </AppText>
                  </Row>
                  <ProgressBar
                    value={item.xp / maxXp}
                    label={`Progression ${topicName(item.names, language, item.topicId)}`}
                  />
                  <AppText variant="caption" tone="muted">
                    {`${item.games} parties`}
                  </AppText>
                </Column>
              </Row>
            </AppCard>
          ))}
        </Column>
      )}
    </Section>
  );
}
