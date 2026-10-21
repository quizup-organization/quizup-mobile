import { Stack, useLocalSearchParams } from "expo-router";

import {
  AppAvatar,
  AppButton,
  AppCard,
  AppChip,
  AppText,
  Column,
  Grid,
  ProgressBar,
  Row,
  Screen,
  Section,
  Spacer,
} from "@/components";
import type { PlayerProfile } from "@/features/player/domain/profile";
import { isOnline } from "@/features/player/domain/profile";
import { useProfile } from "@/features/player/hooks/use-profile";
import { useSetPlayerFollow } from "@/features/player/hooks/use-set-player-follow";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { formatNumber, initials } from "@/shared/utils/format";

function ProfileBody({ profile }: { profile: PlayerProfile }) {
  const follow = useSetPlayerFollow(profile.userId);
  const name = profile.pseudonym ?? "Joueur";
  const online = isOnline(profile.presence);
  const progressRatio =
    profile.progression.xpForNextLevel > 0
      ? profile.progression.xpTotal / profile.progression.xpForNextLevel
      : 0;

  return (
    <>
      <Section>
        <Column spacing={10} alignment="center">
          <AppAvatar initials={initials(name)} size={76} />
          <Column spacing={2} alignment="center">
            <AppText variant="title">{name}</AppText>
            {profile.bio ? (
              <AppText variant="caption" tone="muted" align="center">
                {profile.bio}
              </AppText>
            ) : null}
            <AppText variant="caption" tone="muted">
              {`Niveau ${profile.progression.level} · ${profile.progression.title}${profile.country ? ` · ${profile.country}` : ""}`}
            </AppText>
            <AppText variant="caption" tone={online ? "accent" : "muted"}>
              {online ? "En ligne" : "Hors ligne"}
            </AppText>
          </Column>
          {profile.isMe ? (
            <AppChip label="C'est toi" selected />
          ) : (
            <AppButton
              variant={profile.following ? "text" : "outlined"}
              label={profile.following ? "Suivi" : "Suivre"}
              disabled={follow.isPending}
              onPress={() => follow.mutate(!profile.following)}
            />
          )}
        </Column>
      </Section>

      <Section>
        <AppCard>
          <Row spacing={8} alignment="center">
            <AppText variant="label">Progression</AppText>
            <Spacer flexible />
            <AppText variant="caption" tone="muted">
              {`${formatNumber(profile.progression.xpTotal)} / ${formatNumber(profile.progression.xpForNextLevel)} XP`}
            </AppText>
          </Row>
          <Row alignment="center">
            <ProgressBar value={progressRatio} label="Progression du niveau" />
          </Row>
          <Row spacing={12} alignment="center">
            <AppText variant="caption" tone="muted">
              {`${profile.followingCount} abonnements`}
            </AppText>
            <AppText variant="caption" tone="muted">
              {`${profile.followersCount} abonnés`}
            </AppText>
          </Row>
        </AppCard>
      </Section>

      <Grid
        items={[
          { label: "Parties", value: `${profile.stats.played}` },
          { label: "Victoires", value: `${profile.stats.winPercent} %` },
          { label: "Série", value: `${profile.stats.currentWinStreak} j` },
        ]}
        columns={3}
        gap={10}
        renderItem={(stat, width) => (
          <AppCard width={width}>
            <AppText variant="heading">{stat.value}</AppText>
            <AppText variant="caption" tone="muted">
              {stat.label}
            </AppText>
          </AppCard>
        )}
      />

      <Section title="Badges">
        {profile.progression.badges.length === 0 ? (
          <EmptyState title="Aucun badge pour le moment" />
        ) : (
          <Row spacing={8} alignment="center">
            {profile.progression.badges.map((badge) => (
              <AppChip key={badge.code} label={badge.label} icon="medal" />
            ))}
          </Row>
        )}
      </Section>
    </>
  );
}

export function PlayerPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const profile = useProfile(id);

  if (profile.isLoading) {
    return (
      <Screen>
        <LoadingState label="Chargement du joueur…" />
      </Screen>
    );
  }

  if (profile.isError || !profile.data) {
    return (
      <Screen>
        <ErrorState
          message="Impossible de charger ce joueur."
          onRetry={() => void profile.refetch()}
        />
      </Screen>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{ title: profile.data.pseudonym ?? "Joueur" }}
      />
      <Screen
        refreshing={profile.isRefetching}
        onRefresh={() => void profile.refetch()}
      >
        <ProfileBody profile={profile.data} />
      </Screen>
    </>
  );
}
