import { useState } from "react";
import { useRouter } from "expo-router";

import {
  AppChip,
  AppText,
  AppTextField,
  Carousel,
  Column,
  Screen,
  Section,
} from "@/components";
import type { PeopleDirection } from "@/features/player/domain/profile";
import { PlayerRow } from "@/features/player/components/player-row";
import { usePlayerSearch } from "@/features/player/hooks/use-player-search";
import { usePeopleDirectory } from "@/features/social/hooks/use-people-directory";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";

export function SocialPage() {
  const router = useRouter();
  const [direction, setDirection] = useState<PeopleDirection>("following");
  const [query, setQuery] = useState("");
  const { me, people } = usePeopleDirectory(direction);
  const search = usePlayerSearch(query);
  const searching = query.trim().length >= 2;
  const searchResults = search.data?.content ?? [];

  const refetch = () => {
    void me.refetch();
    void people.refetch();
    void search.refetch();
  };

  if (me.isLoading || people.isLoading) {
    return (
      <Screen tabBar>
        <LoadingState label="Chargement de ton réseau…" />
      </Screen>
    );
  }

  if (me.isError || people.isError) {
    return (
      <Screen tabBar>
        <ErrorState
          message="Impossible de charger le social."
          onRetry={refetch}
        />
      </Screen>
    );
  }

  const items = people.data?.content ?? [];
  const followingCount = me.data?.followingCount ?? 0;
  const followersCount = me.data?.followersCount ?? 0;

  return (
    <Screen
      tabBar
      refreshing={me.isRefetching || people.isRefetching}
      onRefresh={refetch}
    >
      <Section>
        <AppTextField
          defaultValue={query}
          placeholder="Rechercher un joueur"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setQuery}
        />
        {!searching ? (
          <Carousel
            items={[
              {
                direction: "following" as const,
                label: `Abonnements · ${followingCount}`,
              },
              {
                direction: "followers" as const,
                label: `Abonnés · ${followersCount}`,
              },
            ]}
            renderItem={(item) => (
              <AppChip
                label={item.label}
                selected={direction === item.direction}
                onPress={() => setDirection(item.direction)}
              />
            )}
          />
        ) : null}
      </Section>

      {searching ? (
        <Section title="Joueurs trouvés" action={`${searchResults.length}`}>
          {search.isLoading ? (
            <AppText variant="caption" tone="muted">
              Recherche…
            </AppText>
          ) : searchResults.length === 0 ? (
            <EmptyState
              title="Aucun joueur trouvé"
              subtitle="Essaie un autre pseudonyme."
            />
          ) : (
            <Column spacing={2}>
              {searchResults.map((player) => (
                <PlayerRow
                  key={player.userId}
                  player={player}
                  onPress={() => router.push(`/players/${player.userId}`)}
                />
              ))}
            </Column>
          )}
        </Section>
      ) : (
        <Section
          title={direction === "following" ? "Abonnements" : "Abonnés"}
          action={`${items.length}`}
        >
          {items.length === 0 ? (
            <EmptyState
              title={
                direction === "following"
                  ? "Tu ne suis encore personne"
                  : "Aucun abonné pour le moment"
              }
              subtitle="Explore les sujets et les joueurs pour commencer."
            />
          ) : (
            <Column spacing={2}>
              {items.map((player) => (
                <PlayerRow
                  key={player.userId}
                  player={player}
                  onPress={() => router.push(`/players/${player.userId}`)}
                />
              ))}
            </Column>
          )}
        </Section>
      )}
    </Screen>
  );
}
