import { Column, Row, Spacer } from "@expo/ui";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";

import {
  AppAvatar,
  AppButton,
  AppCard,
  AppChip,
  AppIcon,
  AppIconTile,
  AppText,
  Block,
  Screen,
  Section,
} from "@/components";
import { dailyChallenge, leaderboard, streak, topics } from "@/data/fixtures";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Screen tabBar>
      <Block>
        <Column spacing={8}>
          <AppText variant="title">Bonjour Nadjim</AppText>
          <AppText variant="body" tone="muted">
            Prêt pour ta session du jour ?
          </AppText>
          <Row spacing={8} alignment="center">
            <AppChip label={streak.label} icon="fire" selected />
          </Row>
        </Column>
      </Block>

      <Block>
        <AppCard>
          <Row spacing={12} alignment="center">
            <AppIconTile name="bolt" size={44} />
            <Column spacing={2}>
              <AppText variant="heading">{dailyChallenge.title}</AppText>
              <AppText variant="caption" tone="muted">
                {dailyChallenge.subtitle}
              </AppText>
            </Column>
            <Spacer flexible />
            <AppText variant="label" tone="accent">
              {dailyChallenge.reward}
            </AppText>
          </Row>
          <Row spacing={8} alignment="center">
            <AppButton
              label="Jouer maintenant"
              onPress={() => router.push("/topic/sciences")}
            />
            <Spacer flexible />
          </Row>
        </AppCard>
      </Block>

      <Block>
        <Row spacing={8} alignment="center">
          <AppText variant="heading">Populaires</AppText>
          <Spacer flexible />
          <AppText variant="caption" tone="muted">
            Cette semaine
          </AppText>
        </Row>
      </Block>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      >
        {topics.slice(0, 4).map((topic) => (
          <Block key={topic.id} width={176}>
            <AppCard
              width={176}
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
                {`${topic.players.toLocaleString("fr-FR")} joueurs`}
              </AppText>
            </AppCard>
          </Block>
        ))}
      </ScrollView>

      <Section title="Classement" action="Cette semaine">
        <Column spacing={2}>
          {leaderboard.map((entry) => (
            <Row
              key={entry.name}
              spacing={12}
              alignment="center"
              style={{ paddingVertical: 8 }}
            >
              <AppText
                variant="caption"
                tone={entry.rank <= 3 ? "accent" : "muted"}
              >
                {`#${entry.rank}`}
              </AppText>
              <AppAvatar initials={entry.initials} size={36} />
              <Column spacing={2}>
                <AppText variant="label">{entry.name}</AppText>
                <AppText variant="caption" tone="muted">
                  {`${entry.xp.toLocaleString("fr-FR")} XP`}
                </AppText>
              </Column>
              <Spacer flexible />
              {entry.rank === 1 ? (
                <AppIcon name="trophy" size={16} tone="accent" />
              ) : null}
            </Row>
          ))}
        </Column>
      </Section>
    </Screen>
  );
}
