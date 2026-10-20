import { Column } from "@expo/ui";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";
import { categories, topics } from "@/data/fixtures";
import {
  AppCard,
  AppChip,
  AppIconTile,
  AppText,
  Block,
  Inline,
  Screen,
} from "@/ui/primitives";

export default function TopicsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [category, setCategory] = useState("Tous");

  const visible =
    category === "Tous"
      ? topics
      : topics.filter((topic) => topic.category === category);
  const cardWidth = Math.floor((width - 40 - 12) / 2);

  return (
    <Screen>
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
        contentContainerStyle={{ gap: 8, paddingRight: 20 }}
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
            <AppCard onPress={() => router.push(`/topic/${topic.id}`)}>
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
