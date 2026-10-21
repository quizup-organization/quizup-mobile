import { useRouter } from "expo-router";
import { useState } from "react";

import {
  AppCard,
  AppChip,
  AppIconTile,
  AppText,
  Carousel,
  Grid,
  PageHeader,
  Screen,
  Section,
} from "@/components";
import { categories, topics } from "@/data/fixtures";

export default function TopicsScreen() {
  const router = useRouter();
  const [category, setCategory] = useState("Tous");

  const visible =
    category === "Tous"
      ? topics
      : topics.filter((topic) => topic.category === category);

  return (
    <Screen>
      <PageHeader
        title="Sujets"
        subtitle={`${visible.length} sujets disponibles`}
      />

      <Section>
        <Carousel
          items={categories}
          renderItem={(item) => (
            <AppChip
              label={item}
              selected={category === item}
              onPress={() => setCategory(item)}
            />
          )}
        />
      </Section>

      <Grid
        items={visible}
        columns={2}
        gap={12}
        renderItem={(topic, width) => (
          <AppCard
            width={width}
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
        )}
      />
    </Screen>
  );
}
