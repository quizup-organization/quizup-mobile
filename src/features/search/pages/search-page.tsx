import { useRouter } from "expo-router";
import { useState } from "react";

import {
  AppTextField,
  AppText,
  Column,
  Screen,
  Section,
} from "@/components";
import { PlayerRow } from "@/features/player/components/player-row";
import { usePlayerSearch } from "@/features/player/hooks/use-player-search";
import { TopicRow } from "@/features/topics/components/topic-row";
import { useTopics } from "@/features/topics/hooks/use-topics";
import { useContentWidth } from "@/hooks/use-content-width";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";

export function SearchPage() {
  const router = useRouter();
  const width = useContentWidth();
  const [value, setValue] = useState("");
  const query = value.trim();
  const active = query.length >= 2;

  const topics = useTopics({ q: query, page: 0, size: 20 }, active);
  const players = usePlayerSearch(query);

  const refetch = () => {
    void topics.refetch();
    void players.refetch();
  };

  const topicResults = topics.data?.content ?? [];
  const playerResults = players.data?.content ?? [];
  const noResults =
    active && topicResults.length === 0 && playerResults.length === 0;

  let content;

  if (!active) {
    content = (
      <EmptyState
        title="Rechercher"
        subtitle="Tape au moins 2 caractères pour chercher un sujet ou un joueur."
      />
    );
  } else if (topics.isLoading || players.isLoading) {
    content = <LoadingState label="Recherche…" />;
  } else if (topics.isError || players.isError) {
    content = <ErrorState message="La recherche a échoué." onRetry={refetch} />;
  } else if (noResults) {
    content = (
      <EmptyState
        title="Aucun résultat"
        subtitle={`Rien ne correspond à « ${query} ».`}
      />
    );
  } else {
    content = (
      <>
        {topicResults.length > 0 ? (
          <Section title="Sujets">
            <Column spacing={8}>
              {topicResults.map((topic) => (
                <TopicRow
                  key={topic.topicId}
                  topic={topic}
                  onPress={() => router.push(`/topics/${topic.topicId}`)}
                />
              ))}
            </Column>
          </Section>
        ) : null}

        {playerResults.length > 0 ? (
          <Section title="Joueurs">
            <Column spacing={2}>
              {playerResults.map((player) => (
                <PlayerRow
                  key={player.userId}
                  player={player}
                  onPress={() => router.push(`/players/${player.userId}`)}
                />
              ))}
            </Column>
          </Section>
        ) : null}
      </>
    );
  }

  return (
    <Screen
      refreshing={topics.isRefetching || players.isRefetching}
      onRefresh={refetch}
    >
      <AppTextField
        defaultValue=""
        onChangeText={setValue}
        autoFocus
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        placeholder="Rechercher un sujet ou un joueur"
        style={{ width }}
      />

      {content}

      <AppText variant="caption" tone="muted" align="center">
        La recherche s'applique aux sujets et aux joueurs.
      </AppText>
    </Screen>
  );
}
