import { FlatList, View } from "react-native";
import { TopicCard } from "./topic-card";
import type { Topic } from "@/shared/types/domain";

interface TopicCarouselProps {
  topics: Topic[];
  onOpen: (topicId: string) => void;
}

/** Bandeau horizontal de sujets (FlatList horizontale). */
export function TopicCarousel({ topics, onOpen }: TopicCarouselProps) {
  return (
    <FlatList
      horizontal
      data={topics}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 16, paddingVertical: 4 }}
      renderItem={({ item }) => (
        <View style={{ width: 272 }}>
          <TopicCard topic={item} onOpen={onOpen} />
        </View>
      )}
    />
  );
}
