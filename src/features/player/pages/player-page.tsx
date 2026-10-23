import { Stack, useLocalSearchParams } from "expo-router";

import { useContentWidth } from "@/hooks/use-content-width";

import {
  AppAvatar,
  AppButton,
  AppCard,
  AppImage,
  AppChip,
  AppText,
  Column,
  Grid,
  Row,
  Screen,
  Section,
  Spacer,
} from "@/components";
import type { PlayerProfile } from "@/features/player/domain/profile";
import { isOnline } from "@/features/player/domain/profile";
import { useProfile } from "@/features/player/hooks/use-profile";
import { usePlayerTitles } from "@/features/profile/hooks/use-player-titles";
import { useMe } from "@/features/profile/hooks/use-me";
import { masteryGradeLabel } from "@/features/topics/domain/mastery";
import { topicName } from "@/features/topics/domain/topic";
import { useSetPlayerFollow } from "@/features/player/hooks/use-set-player-follow";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { formatNumber } from "@/shared/utils/format";

function ProfileBody({ profile }: { profile: PlayerProfile }) {
  const width = useContentWidth();
  const language = useMe().data?.language ?? "fr";
  const titles = usePlayerTitles(profile.userId);
  const follow = useSetPlayerFollow(profile.userId);
  const name = profile.pseudonym ?? "Joueur";
  const online = isOnline(profile.presence);
  const ratingLabel = profile.progression.provisional
    ? "Elo provisoire"
    : `Elo ${formatNumber(profile.progression.rating)}`;

  return (
    <>
      {profile.bannerUrl ? (
        <AppImage
          source={{ uri: profile.bannerUrl }}
          width={width}
          height={150}
          radius={18}
          accessibilityLabel={`Bannière de ${name}`}
        />
      ) : null}

      <Section>
        <Column spacing={10} alignment="center">
          <AppAvatar
            name={name}
            userId={profile.userId}
            avatarOptions={profile.avatarOptions}
            size={84}
          />
          <Column spacing={2} alignment="center">
            <AppText variant="title">{name}</AppText>
            {profile.bio ? (
              <AppText variant="caption" tone="muted" align="center">
                {profile.bio}
              </AppText>
            ) : null}
            <AppText variant="caption" tone="muted">
              {`${ratingLabel}${profile.country ? ` · ${profile.country}` : ""}`}
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

      <Grid
        items={[
          {
            label: "Elo",
            value: `${formatNumber(profile.progression.rating)}`,
          },
          { label: "Parties", value: `${profile.stats.played}` },
          { label: "Victoires", value: `${profile.stats.winPercent} %` },
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

      <Section>
        <AppCard>
          <Row spacing={12} alignment="center">
            <AppText variant="caption" tone="muted">
              {`${profile.followingCount} abonnements`}
            </AppText>
            <AppText variant="caption" tone="muted">
              {`${profile.followersCount} abonnés`}
            </AppText>
            <AppChip
              label={`Pic ${formatNumber(profile.progression.peakRating)}`}
            />
          </Row>
        </AppCard>
      </Section>

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

      <Section title="Titres">
        {titles.isLoading ? (
          <AppText variant="caption" tone="muted">
            Chargement des titres…
          </AppText>
        ) : (titles.data?.titles.length ?? 0) === 0 ? (
          <EmptyState
            title="Aucun titre débloqué"
            subtitle="Les titres se gagnent en maîtrisant les sujets."
          />
        ) : (
          <Column spacing={8}>
            {titles.data!.titles.slice(0, 4).map((title) => (
              <AppCard key={title.key}>
                <Row spacing={10} alignment="center">
                  <AppText variant="heading">
                    {title.topic.emoji ?? "🏅"}
                  </AppText>
                  <Column spacing={2}>
                    <AppText variant="label">
                      {`${masteryGradeLabel(title.grade)} · ${topicName(
                        title.topic.names,
                        language,
                        title.topicId,
                      )}`}
                    </AppText>
                    <AppText variant="caption" tone="muted">
                      {`${formatNumber(title.gradeRemainingXp)} XP avant le grade suivant`}
                    </AppText>
                  </Column>
                  <Spacer flexible />
                  {titles.data?.equippedKey === title.key ? (
                    <AppChip label="Porté" selected />
                  ) : null}
                </Row>
              </AppCard>
            ))}
          </Column>
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
