import { AppCard, AppText, Row } from "@/components";
import type { TopicCard as TopicCardView } from "@/features/topics/domain/topic";
import { topicName } from "@/features/topics/domain/topic";
import { TopicEmoji } from "@/features/topics/components/topic-emoji";
import { formatNumber } from "@/shared/utils/format";

export function TopicCard({
  topic,
  width,
  onPress,
  language = "fr",
}: {
  topic: TopicCardView;
  width?: number;
  onPress?: () => void;
  language?: "fr" | "en";
}) {
  const name = topicName(topic.names, language, topic.topicId);

  return (
    <AppCard
      width={width}
      onPress={onPress}
      accessibilityLabel={`Sujet ${name}`}
    >
      <Row spacing={10} alignment="center">
        <TopicEmoji emoji={topic.emoji} color={topic.color} />
        <AppText variant="label" numberOfLines={1}>
          {name}
        </AppText>
      </Row>
      <AppText variant="caption" tone="muted" numberOfLines={1}>
        {topic.categoryLabel ?? "Sujet"}
      </AppText>
      <Row spacing={8} alignment="center">
        <AppText variant="caption" tone="muted">
          {`${formatNumber(topic.followersCount)} abonnés`}
        </AppText>
        <AppText variant="caption" tone="muted">
          {`${topic.questionsCount} questions`}
        </AppText>
      </Row>
      {topic.followed ? (
        <AppText variant="caption" tone="accent">
          Suivi
        </AppText>
      ) : null}
    </AppCard>
  );
}
