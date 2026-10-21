import { Column } from "@expo/ui";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

import {
  AppCard,
  AppChip,
  AppIconTile,
  AppText,
  Block,
  Inline,
  Screen,
} from "@/components";
import { categories, topics } from "@/data/fixtures";
import { useContentWidth } from "@/hooks/use-content-width";

export default function TopicsScreen() {
  const router = useRouter();
  const contentWidth = useContentWidth();
  const [category, setCategory] = useState("Tous");

  const visible =
    category === "Tous"
      ? topics
      : topics.filter((topic) => topic.category === category);
  const cardWidth = Math.floor((contentWidth - 12) / 2);

  return (
    <Screen tabBar>
      <Block>
        <Column spacing={4}>
          <AppText variant="title">Sujets</AppText>
          <AppText variant="body" tone="muted">
            {`${visible.length} sujets disponibles`}
          </AppText>
        </Column>
      </Block>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {categories.map((item) => (
          <Inline key={item}>
            <AppChip
              label={item}
              selected={category === item}
              onPress={() => setCategory(item)}
            />
          </Inline>
        ))}
      </ScrollView>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {visible.map((topic) => (
          <Block key={topic.id} width={cardWidth}>
            <AppCard
              width={cardWidth}
              onPress={() => router.push(`/topic/${topic.id}`)}
            >
              <AppIconTile
                name={topic.icon}
                background={topic.background}
                color={topic.foreground}
                size={44}
              />
              <AppText variant="label" numberOfLines={1}>
                {topic.name}
              </AppText>
              <AppText variant="caption" tone="muted">
                {topic.category}
              </AppText>
            </AppCard>
          </Block>
        ))}
      </View>
    </Screen>
  );
}
