import { useState } from "react";
import { Stack, useRouter } from "expo-router";

import {
  AppButton,
  AppCard,
  AppChip,
  AppIconTile,
  AppText,
  Column,
  Grid,
  Row,
  Screen,
  Section,
  Spacer,
} from "@/components";
import { useCompleteOnboarding } from "@/features/profile/hooks/use-complete-onboarding";
import { useCreateBotRoom } from "@/features/rooms/hooks/use-create-bot-room";
import { useTopicFacets } from "@/features/topics/hooks/use-topic-facets";
import { useTopics } from "@/features/topics/hooks/use-topics";
import { useContentWidth } from "@/hooks/use-content-width";
import { isMockData } from "@/lib/config";
import { formatNumber } from "@/shared/utils/format";

const MAX_CATEGORIES = 3;

const PROGRESSION_CARDS = [
  {
    icon: "trophy" as const,
    title: "Un Elo, pas un niveau",
    body: "Ton classement global mesure ton niveau. Les XP restent rattachées à chaque sujet.",
  },
  {
    icon: "medal" as const,
    title: "Une maîtrise par sujet",
    body: "Chaque thème a ses grades, ses titres et ses badges. Progresse à ton rythme.",
  },
  {
    icon: "game" as const,
    title: "Des duels rapides",
    body: "Défie un bot ou un ami, réponds vite et grimpe dans le classement du sujet.",
  },
];

export function OnboardingPage() {
  const router = useRouter();
  const width = useContentWidth();
  const facets = useTopicFacets();
  const complete = useCompleteOnboarding();
  const createBot = useCreateBotRoom();
  const [step, setStep] = useState<0 | 1>(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const duelTopic = useTopics(
    {
      category: selected[0],
      sort: "MOST_PLAYED",
      page: 0,
      size: 1,
    },
    step === 1,
  );

  const categories = (facets.data?.categories ?? []).filter(
    (category) => category.count > 0,
  );
  const busy = complete.isPending || createBot.isPending;

  function toggle(category: string) {
    setSelected((current) => {
      if (current.includes(category)) {
        return current.filter((item) => item !== category);
      }
      if (current.length >= MAX_CATEGORIES) return current;
      return [...current, category];
    });
  }

  async function finish(startDuel: boolean) {
    if (busy) return;
    setError(null);

    try {
      await complete.mutateAsync();
    } catch {
      setError("Impossible d'enregistrer ton onboarding. Réessaie.");
      return;
    }

    if (startDuel && duelTopic.data?.content[0]) {
      try {
        const room = await createBot.mutateAsync(
          duelTopic.data.content[0].topicId,
        );
        router.replace(`/rooms/${room.id}`);
        return;
      } catch {
        // La partie pourra être relancée depuis le sujet ; on ne bloque pas l'entrée.
      }
    }

    router.replace("/");
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Screen topInset align="center">
        <Column spacing={8} alignment="center" style={{ width }}>
          <AppText variant="display">Bienvenue sur QuizUp</AppText>
          <AppText variant="body" tone="muted" align="center" width={width}>
            Choisis tes centres d'intérêt et découvre une progression qui a du sens.
          </AppText>
        </Column>

        <Row spacing={8} alignment="center">
          <AppChip label="1 · Centres d'intérêt" selected={step === 0} />
          <AppChip label="2 · Prêt à jouer" selected={step === 1} />
        </Row>

        {step === 0 ? (
          <>
            <Section title="Qu'est-ce qui t'intéresse ?">
              <AppText variant="caption" tone="muted">
                {`${selected.length}/${MAX_CATEGORIES} catégories sélectionnées`}
              </AppText>

              {facets.isLoading ? (
                <AppText variant="caption" tone="muted">
                  Chargement des catégories…
                </AppText>
              ) : facets.isError ? (
                <Column spacing={8}>
                  <AppText variant="caption" tone="danger">
                    Impossible de charger les catégories.
                  </AppText>
                  <AppButton
                    label="Réessayer"
                    variant="outlined"
                    onPress={() => void facets.refetch()}
                  />
                </Column>
              ) : (
                <Grid
                  items={categories}
                  columns={2}
                  gap={10}
                  renderItem={(category, cardWidth) => {
                    const selectedCategory = selected.includes(
                      category.category,
                    );
                    return (
                      <AppCard
                        width={cardWidth}
                        onPress={() => toggle(category.category)}
                        accessibilityLabel={`${selectedCategory ? "Retirer" : "Ajouter"} ${category.label}`}
                      >
                        <AppText
                          variant="heading"
                          tone={selectedCategory ? "accent" : "default"}
                          numberOfLines={1}
                        >
                          {category.label}
                        </AppText>
                        <AppText variant="caption" tone="muted">
                          {`${formatNumber(category.count)} sujets`}
                        </AppText>
                        <AppChip
                          label={selectedCategory ? "Sélectionné" : "Choisir"}
                          selected={selectedCategory}
                        />
                      </AppCard>
                    );
                  }}
                />
              )}
            </Section>

            <Column spacing={8} style={{ width }}>
              <AppButton
                label="Continuer"
                disabled={selected.length === 0 || facets.isLoading}
                style={{ width }}
                onPress={() => setStep(1)}
              />
              <AppButton
                label="Passer cette étape"
                variant="text"
                disabled={busy}
                onPress={() => void finish(false)}
              />
            </Column>
          </>
        ) : (
          <>
            <Section title="Comment ça marche ?">
              <Column spacing={10}>
                {PROGRESSION_CARDS.map((item) => (
                  <AppCard key={item.title}>
                    <Row spacing={12} alignment="center">
                      <AppIconTile name={item.icon} size={42} />
                      <Column spacing={2}>
                        <AppText variant="label">{item.title}</AppText>
                        <AppText variant="caption" tone="muted">
                          {item.body}
                        </AppText>
                      </Column>
                    </Row>
                  </AppCard>
                ))}
              </Column>
            </Section>

            {error ? (
              <AppText variant="caption" tone="danger" align="center">
                {error}
              </AppText>
            ) : null}

            <Column spacing={8} style={{ width }}>
              <AppButton
                label={
                  duelTopic.isLoading
                    ? "Préparation…"
                    : "Lancer mon premier duel"
                }
                disabled={busy || isMockData || !duelTopic.data?.content[0]}
                style={{ width }}
                onPress={() => void finish(true)}
              />
              <AppButton
                label="Explorer les sujets"
                variant="outlined"
                disabled={busy}
                style={{ width }}
                onPress={() => void finish(false)}
              />
              {isMockData ? (
                <AppText variant="caption" tone="muted" align="center">
                  Le duel sera disponible une fois connecté.
                </AppText>
              ) : null}
              <Row spacing={8} alignment="center">
                <AppButton
                  label="Retour"
                  variant="text"
                  disabled={busy}
                  onPress={() => setStep(0)}
                />
                <Spacer flexible />
                <AppButton
                  label="Passer"
                  variant="text"
                  disabled={busy}
                  onPress={() => void finish(false)}
                />
              </Row>
            </Column>
          </>
        )}
      </Screen>
    </>
  );
}
