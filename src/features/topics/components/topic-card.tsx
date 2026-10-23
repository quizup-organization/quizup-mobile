import { Row as NativeRow, Spacer as NativeSpacer, Text } from "@expo/ui";

import {
  AppCard,
  AppChip,
  AppImage,
  AppText,
  Row,
  Spacer,
  useScreenWidth,
} from "@/components";
import type { TopicCard as TopicCardView } from "@/features/topics/domain/topic";
import { topicName } from "@/features/topics/domain/topic";
import { formatNumber } from "@/shared/utils/format";
import { useNativeColors } from "@/theme";

export function TopicCard({
  topic,
  width,
  onPress,
  language = "fr",
  rank,
  description = false,
}: {
  topic: TopicCardView;
  width?: number;
  onPress?: () => void;
  language?: "fr" | "en";
  rank?: number;
  description?: boolean;
}) {
  const screenWidth = useScreenWidth();
  const colors = useNativeColors();
  const cardWidth = width ?? screenWidth;
  const innerWidth = cardWidth - 30;
  const imageHeight = Math.round(innerWidth * 0.54);
  const name = topicName(topic.names, language, topic.topicId);

  return (
    <AppCard
      width={width}
      onPress={onPress}
      accessibilityLabel={`Sujet ${name}`}
      spacing={10}
    >
      {topic.imageUrl ? (
        <AppImage
          source={{ uri: topic.imageUrl }}
          width={innerWidth}
          height={imageHeight}
          radius={13}
          accessibilityLabel={`Illustration de ${name}`}
        />
      ) : (
        <NativeRow
          alignment="center"
          style={{
            width: innerWidth,
            height: imageHeight,
            borderRadius: 13,
            backgroundColor: topic.color ?? colors.fill,
          }}
        >
          <NativeSpacer flexible />
          <Text textStyle={{ fontSize: 42 }}>{topic.emoji ?? "❓"}</Text>
          <NativeSpacer flexible />
        </NativeRow>
      )}

      <Row spacing={8} alignment="center">
        <AppText variant="caption" tone="accent" numberOfLines={1}>
          {topic.categoryLabel ?? "Sujet"}
        </AppText>
        <Spacer flexible />
        {rank ? <AppChip label={`#${rank}`} /> : null}
        {topic.followed ? <AppChip label="Suivi" selected /> : null}
      </Row>

      <AppText variant="heading" numberOfLines={2}>
        {name}
      </AppText>

      {description && topic.description ? (
        <AppText variant="caption" tone="muted" numberOfLines={2}>
          {topic.description}
        </AppText>
      ) : null}

      <Row spacing={10} alignment="center">
        <AppText variant="caption" tone="muted">
          {`${formatNumber(topic.followersCount)} abonnés`}
        </AppText>
        <AppText variant="caption" tone="muted">
          {`${formatNumber(topic.questionsCount)} questions`}
        </AppText>
      </Row>
    </AppCard>
  );
}
