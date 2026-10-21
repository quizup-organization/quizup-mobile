import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

import {
  AppButton,
  AppCard,
  AppChip,
  AppIcon,
  AppIconTile,
  AppText,
  Column,
  ProgressBar,
  Row,
  Screen,
  Section,
  Spacer,
} from "@/components";
import { findTopic } from "@/data/fixtures";

const AGENDA = [
  "Questions à choix unique, 15 secondes par question",
  "Score bonus pour les réponses rapides",
  "Résumé détaillé à la fin de la partie",
];

export default function TopicDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const topic = findTopic(id);
  const [started, setStarted] = useState(false);

  if (!topic) {
    return (
      <Screen>
        <Section>
          <Column spacing={8}>
            <AppText variant="title">Sujet introuvable</AppText>
            <AppText variant="body" tone="muted">
              Ce sujet n'existe pas dans cette démo.
            </AppText>
          </Column>
        </Section>
        <Row spacing={8} alignment="center">
          <AppButton
            label="Retour"
            variant="text"
            onPress={() => router.back()}
          />
        </Row>
      </Screen>
    );
  }

  return (
    <Screen>
      <Row spacing={8} alignment="center" onPress={() => router.back()}>
        <AppIcon name="back" size={18} tone="accent" />
        <AppText variant="label" tone="accent">
          Retour
        </AppText>
      </Row>

      <Section>
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
      </Section>

      <Section>
        <AppCard>
          <Row spacing={8} alignment="center">
            <AppText variant="label">Maîtrise</AppText>
            <Spacer flexible />
            <AppText variant="caption" tone="muted">
              {`${topic.players.toLocaleString("fr-FR")} joueurs`}
            </AppText>
          </Row>
          <Row alignment="center">
            <ProgressBar value={topic.mastery} />
          </Row>
        </AppCard>
      </Section>

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

      <Row spacing={8} alignment="center">
        <AppButton
          label={started ? "Terminer la démo" : "Jouer une partie démo"}
          onPress={() => setStarted((value) => !value)}
        />
        <Spacer flexible />
      </Row>

      {started ? (
        <Section>
          <AppCard>
            <AppText variant="heading">Partie simulée</AppText>
            <AppText variant="caption" tone="muted">
              {`5 questions · ${topic.name} — aucune donnée réelle, aucun appel réseau.`}
            </AppText>
          </AppCard>
        </Section>
      ) : null}
    </Screen>
  );
}
