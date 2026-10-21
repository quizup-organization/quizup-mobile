import { useState } from "react";
import { useRouter } from "expo-router";

import {
  AppChip,
  Carousel,
  Column,
  Screen,
  Section,
} from "@/components";
import type { PeopleDirection } from "@/features/player/domain/profile";
import { PlayerRow } from "@/features/player/components/player-row";
import { usePeopleDirectory } from "@/features/social/hooks/use-people-directory";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";

export function SocialPage() {
  const router = useRouter();
  const [direction, setDirection] = useState<PeopleDirection>("following");
  const { me, people } = usePeopleDirectory(direction);

  const refetch = () => {
    void me.refetch();
    void people.refetch();
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
        <Carousel
          items={[
            { direction: "following" as const, label: `Abonnements · ${followingCount}` },
            { direction: "followers" as const, label: `Abonnés · ${followersCount}` },
          ]}
          renderItem={(item) => (
            <AppChip
              label={item.label}
              selected={direction === item.direction}
              onPress={() => setDirection(item.direction)}
            />
          )}
        />
      </Section>

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
    </Screen>
  );
}
