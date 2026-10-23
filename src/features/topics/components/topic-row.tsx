import { AppCard, AppText, Column, Row, Spacer } from "@/components";
import { TopicEmoji } from "@/features/topics/components/topic-emoji";
import type { TopicCard as TopicCardView } from "@/features/topics/domain/topic";
import { topicName } from "@/features/topics/domain/topic";
import { formatNumber } from "@/shared/utils/format";

/** Ligne compacte de sujet (recherche, listes denses). */
export function TopicRow({
  topic,
  onPress,
  language = "fr",
}: {
  topic: TopicCardView;
  onPress?: () => void;
  language?: "fr" | "en";
}) {
  const name = topicName(topic.names, language, topic.topicId);

  return (
    <AppCard
      onPress={onPress}
      accessibilityLabel={`Sujet ${name}`}
    >
      <Row spacing={10} alignment="center">
        <TopicEmoji
          emoji={topic.emoji}
          color={topic.color}
          imageUrl={topic.imageUrl}
          size={36}
        />
        <Column spacing={2}>
          <AppText variant="label" numberOfLines={1}>
            {name}
          </AppText>
          <AppText variant="caption" tone="muted" numberOfLines={1}>
            {topic.categoryLabel ?? "Sujet"}
          </AppText>
        </Column>
        <Spacer flexible />
        <AppText variant="caption" tone="muted">
          {`${formatNumber(topic.followersCount)} abonnés`}
        </AppText>
      </Row>
    </AppCard>
  );
}
