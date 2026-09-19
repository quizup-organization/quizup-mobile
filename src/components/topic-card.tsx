import { Pressable, View } from "react-native";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { TopicIcon } from "./topic-icon";
import { categoryColor, categoryLabel } from "@/shared/utils/categories";
import type { Topic } from "@/shared/types/domain";

interface TopicCardProps {
  topic: Topic;
  onOpen: (topicId: string) => void;
}

/** Carte de sujet minimaliste — icône + catégorie + nom. */
export function TopicCard({ topic, onOpen }: TopicCardProps) {
  return (
    <Pressable onPress={() => onOpen(topic.id)}>
      <Card className="flex-row items-center gap-3">
        <TopicIcon topic={topic} size={44} />
        <View className="min-w-0 flex-1">
          <View className="flex-row items-center gap-1.5">
            <View
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: categoryColor(topic.category) }}
            />
            <Text className="text-xs text-muted-foreground">
              {categoryLabel(topic.category, topic.category)}
            </Text>
          </View>
          <Text className="text-[15px] font-semibold" numberOfLines={1}>
            {topic.name}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}
