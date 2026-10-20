import { Column, Icon, Row, Spacer } from "@expo/ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useWindowDimensions } from "react-native";
import { findTopic } from "@/data/fixtures";
import { icons } from "@/ui/icons";
import {
  AppBar,
  AppButton,
  AppCard,
  AppChip,
  AppIconTile,
  AppText,
  Block,
  Screen,
  Section,
} from "@/ui/primitives";
import { radius, useColors } from "@/ui/theme";

const AGENDA = [
  "Questions à choix unique, 15 secondes par question",
  "Score bonus pour les réponses rapides",
  "Résumé détaillé à la fin de la partie",
];

export default function TopicDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const topic = findTopic(id);
  const c = useColors();
  const { width } = useWindowDimensions();
  const [started, setStarted] = useState(false);

  const contentWidth = Math.min(width - 40, 480);

  if (!topic) {
    return (
      <Screen>
        <Block>
          <Column spacing={8}>
            <AppText variant="title">Sujet introuvable</AppText>
            <AppText variant="body" tone="muted">
              Ce sujet n'existe pas dans cette démo.
            </AppText>
          </Column>
        </Block>
        <Block>
          <Row spacing={8} alignment="center">
            <AppButton label="Retour" variant="text" onPress={() => router.back()} />
          </Row>
        </Block>
      </Screen>
    );
  }

  return (
    <Screen>
      <Block>
        <Row spacing={8} alignment="center" onPress={() => router.back()}>
          <Icon name={icons.back} size={18} color={c.accent} />
          <AppText variant="label" tone="accent">
            Retour
          </AppText>
        </Row>
      </Block>

      <Block>
        <Column
          spacing={14}
          style={{
            padding: 18,
            backgroundColor: c.surface,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: c.border,
          }}
        >
          <Row spacing={14} alignment="center">
            <AppIconTile
              name={topic.icon}
              size={56}
              background={topic.background}
              color={topic.foreground}
            />
            <Column spacing={2}>
              <AppText variant="title">{topic.name}</AppText>
              <AppText variant="caption" tone="muted">
                {topic.category}
              </AppText>
            </Column>
            <Spacer flexible />
            <AppChip label={`${Math.round(topic.mastery * 100)} %`} icon="star" />
          </Row>

          <AppText variant="body" tone="muted">
            {topic.blurb}
          </AppText>
        </Column>
      </Block>

      <Block>
        <Column
          spacing={10}
          style={{
            padding: 16,
            backgroundColor: c.surface,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: c.border,
          }}
        >
          <Row spacing={8} alignment="center">
            <AppText variant="label">Maîtrise</AppText>
            <Spacer flexible />
            <AppText variant="caption" tone="muted">
              {`${topic.players.toLocaleString("fr-FR")} joueurs`}
            </AppText>
          </Row>
          <Row alignment="center">
            <AppBar value={topic.mastery} width={contentWidth - 32} />
          </Row>
        </Column>
      </Block>

      <Section title="Au programme">
        <Column spacing={8}>
          {AGENDA.map((item) => (
            <Row key={item} spacing={10} alignment="center">
              <Icon name={icons.chevron} size={14} color={c.accent} />
              <AppText variant="caption" tone="muted">
                {item}
              </AppText>
            </Row>
          ))}
        </Column>
      </Section>

      <Block>
        <Row spacing={8} alignment="center">
          <AppButton
            label={started ? "Terminer la démo" : "Jouer une partie démo"}
            onPress={() => setStarted((value) => !value)}
          />
          <Spacer flexible />
        </Row>
      </Block>

      {started ? (
        <Block>
          <AppCard tone="accent">
            <AppText variant="heading">Partie simulée</AppText>
            <AppText variant="caption" tone="muted">
              {`5 questions · ${topic.name} — aucune donnée réelle, aucun appel réseau.`}
            </AppText>
          </AppCard>
        </Block>
      ) : null}
    </Screen>
  );
}
