import { View } from "react-native";
import { Text } from "@/components/ui/text";

interface TopicIconProps {
  topic: { emoji: string; color: string };
  size?: number;
}

/** Pastille de sujet (emoji sur fond éditorial). */
export function TopicIcon({ topic, size = 44 }: TopicIconProps) {
  return (
    <View
      className="items-center justify-center rounded-2xl"
      style={{ width: size, height: size, backgroundColor: topic.color }}
    >
      <Text style={{ fontSize: size * 0.5, lineHeight: size * 0.6 }}>
        {topic.emoji}
      </Text>
    </View>
  );
}
