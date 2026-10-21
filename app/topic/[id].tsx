import { Column, Row, Spacer } from "@expo/ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

import {
  AppButton,
  AppCard,
  AppChip,
  AppIcon,
  AppIconTile,
  AppText,
  Block,
  ProgressBar,
  Screen,
  Section,
} from "@/components";
import { findTopic } from "@/data/fixtures";
import { useContentWidth } from "@/hooks/use-content-width";

const AGENDA = [
  "Questions à choix unique, 15 secondes par question",
  "Score bonus pour les réponses rapides",
  "Résumé détaillé à la fin de la partie",
];

export default function TopicDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const topic = findTopic(id);
  const contentWidth = useContentWidth();
  const [started, setStarted] = useState(false);

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
            <AppButton
              label="Retour"
              variant="text"
              onPress={() => router.back()}
            />
          </Row>
        </Block>
      </Screen>
    );
  }

  return (
    <Screen>
      <Block>
        <Row spacing={8} alignment="center" onPress={() => router.back()}>
          <AppIcon name="back" size={18} tone="accent" />
          <AppText variant="label" tone="accent">
            Retour
          </AppText>
        </Row>
      </Block>

      <Block>
        <AppCard>
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
            <AppChip
              label={`${Math.round(topic.mastery * 100)} %`}
              icon="star"
            />
          </Row>

          <AppText variant="body" tone="muted">
            {topic.blurb}
          </AppText>
        </AppCard>
      </Block>

      <Block>
        <AppCard>
          <Row spacing={8} alignment="center">
            <AppText variant="label">Maîtrise</AppText>
            <Spacer flexible />
            <AppText variant="caption" tone="muted">
              {`${topic.players.toLocaleString("fr-FR")} joueurs`}
            </AppText>
          </Row>
          <Row alignment="center">
            <ProgressBar value={topic.mastery} width={contentWidth - 30} />
          </Row>
        </AppCard>
      </Block>

      <Section title="Au programme">
        <Column spacing={8}>
          {AGENDA.map((item) => (
            <Row key={item} spacing={10} alignment="center">
              <AppIcon name="chevron" size={14} tone="accent" />
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
          <AppCard>
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
