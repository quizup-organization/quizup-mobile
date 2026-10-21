import { Column, Row, Spacer } from "@expo/ui";
import { ScrollView } from "react-native";

import {
  AppAvatar,
  AppCard,
  AppChip,
  AppIconTile,
  AppRow,
  AppText,
  Block,
  Inline,
  Screen,
  Section,
} from "@/components";
import { activity, friends, topics } from "@/data/fixtures";

export default function SocialScreen() {
  return (
    <Screen tabBar>
      <Block>
        <Column spacing={4}>
          <AppText variant="title">Social</AppText>
          <AppText variant="body" tone="muted">
            Tes amis et leurs derniers défis.
          </AppText>
        </Column>
      </Block>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {friends.slice(0, 4).map((friend) => (
          <Inline key={friend.id}>
            <AppChip
              label={`${friend.name} · ${friend.level}`}
              icon="social"
            />
          </Inline>
        ))}
      </ScrollView>

      <Section title="Amis" action={`${friends.length} joueurs`}>
        <Column spacing={2}>
          {friends.map((friend) => (
            <Row
              key={friend.id}
              spacing={12}
              alignment="center"
              style={{ paddingVertical: 8 }}
            >
              <AppAvatar initials={friend.initials} size={40} />
              <Column spacing={2}>
                <AppText variant="label">{friend.name}</AppText>
                <AppText variant="caption" tone="muted">
                  {`Niveau ${friend.level} · ${friend.status}`}
                </AppText>
              </Column>
              <Spacer flexible />
            </Row>
          ))}
        </Column>
      </Section>

      <Section title="Activité récente">
        <Column spacing={10}>
          {activity.map((item) => (
            <AppCard key={item.id}>
              <Row spacing={12} alignment="center">
                <AppIconTile name="trend" size={36} />
                <Column spacing={2}>
                  <AppText variant="label">{item.title}</AppText>
                  <AppText variant="caption" tone="muted">
                    {item.subtitle}
                  </AppText>
                </Column>
                <Spacer flexible />
                <AppText variant="caption" tone="accent">
                  {item.xp}
                </AppText>
              </Row>
            </AppCard>
          ))}
        </Column>
      </Section>

      <Section title="Sujets suivis">
        <Column spacing={2}>
          {topics.slice(0, 3).map((topic) => (
            <AppRow
              key={topic.id}
              icon={topic.icon}
              title={topic.name}
              subtitle={topic.category}
              trailing={`${Math.round(topic.mastery * 100)} %`}
            />
          ))}
        </Column>
      </Section>
    </Screen>
  );
}
