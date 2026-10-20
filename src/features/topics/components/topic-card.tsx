import { View } from "react-native";
import { Image } from "expo-image";
import {
  Card,
  PressableFeedback,
  Typography,
} from "heroui-native";
import { categoryColor, categoryLabel } from "@/shared/utils/categories";
import { topicName } from "@/shared/utils/topic-name";
import { compactNumber } from "@/lib/helpers";
import type { Language, TopicCardView } from "@/shared/types/bff";

export type TopicCardVariant = "grid" | "poster" | "landscape";

interface TopicCardProps {
  topic: TopicCardView;
  language: Language;
  onPress: () => void;
  width?: number;
  variant?: TopicCardVariant;
  rank?: number;
}

function imageHeight(variant: TopicCardVariant): number {
  if (variant === "poster") return 196;
  if (variant === "landscape") return 132;
  return 116;
}

/** Carte de sujet mobile : formats grille, affiche (Top 10) et paysage. */
export function TopicCard({
  topic,
  language,
  onPress,
  width = 190,
  variant = "grid",
  rank,
}: TopicCardProps) {
  const name = topicName(topic.names, language);
  const category = topic.category
    ? categoryLabel(topic.category, topic.categoryLabel ?? undefined)
    : null;
  const image = topic.imageUrl ?? topic.bannerUrl;
  const accent = topic.color ?? categoryColor(topic.category ?? "");

  return (
    <PressableFeedback
      accessibilityRole="button"
      accessibilityLabel={name}
      onPress={onPress}
      style={{ width }}
      className="rounded-3xl"
    >
      <Card className="overflow-hidden rounded-3xl border border-border bg-surface p-0 shadow-none">
        <View
          className="w-full items-center justify-center"
          style={{ height: imageHeight(variant), backgroundColor: accent }}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={150}
            />
          ) : (
            <Typography type="h1">{topic.emoji?.trim() || "❓"}</Typography>
          )}

          {rank ? (
            <View className="absolute left-2.5 top-2.5 h-7 min-w-7 items-center justify-center rounded-full bg-background/90 px-2">
              <Typography type="body-xs" weight="bold">
                #{rank}
              </Typography>
            </View>
          ) : null}

          {variant !== "poster" && topic.questionsCount > 0 ? (
            <View className="absolute bottom-2.5 right-2.5 rounded-full bg-background/90 px-2 py-1">
              <Typography type="body-xs" weight="medium">
                {topic.questionsCount} questions
              </Typography>
            </View>
          ) : null}
        </View>

        <View className="gap-1.5 p-3">
          {category ? (
            <View className="flex-row items-center gap-1.5">
              <View
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: accent }}
              />
              <Typography
                type="body-xs"
                color="muted"
                numberOfLines={1}
                className="uppercase tracking-wide"
              >
                {category}
              </Typography>
            </View>
          ) : null}

          <Typography
            type={variant === "poster" ? "h6" : "body-sm"}
            weight="semibold"
            numberOfLines={2}
          >
            {name}
          </Typography>

          <View className="flex-row items-center justify-between gap-2">
            <Typography type="body-xs" color="muted">
              {compactNumber(topic.followersCount)} abonnés
            </Typography>
            {variant === "poster" ? (
              <Typography type="body-xs" color="muted">
                {topic.questionsCount} q.
              </Typography>
            ) : null}
          </View>
        </View>
      </Card>
    </PressableFeedback>
  );
}
