import { useRouter } from "expo-router";

import {
  AppAvatar,
  AppCard,
  AppChip,
  AppRow,
  AppText,
  Column,
  Grid,
  Row,
  Screen,
  Section,
} from "@/components";
import { useAuth } from "@/features/auth";
import { useMe } from "@/features/profile/hooks/use-me";
import { isMockAuth, isMockData } from "@/lib/config";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { formatNumber, initials } from "@/shared/utils/format";

export function ProfilePage() {
  const router = useRouter();
  const me = useMe();
  const { logout } = useAuth();

  if (me.isLoading) {
    return (
      <Screen tabBar>
        <LoadingState label="Chargement de ton profil…" />
      </Screen>
    );
  }

  if (me.isError || !me.data) {
    return (
      <Screen tabBar>
        <ErrorState
          message="Impossible de charger ton profil."
          onRetry={() => void me.refetch()}
        />
      </Screen>
    );
  }

  const profile = me.data;
  const displayName = profile.pseudonym ?? "Joueur";
  const demo = isMockAuth || isMockData;
  const rewardsCount = profile.rewards?.length ?? 0;

  return (
    <Screen
      tabBar
      refreshing={me.isRefetching}
      onRefresh={() => void me.refetch()}
    >
      <Section>
        <Column spacing={10} alignment="center">
          <AppAvatar initials={initials(displayName)} size={76} />
          <Column spacing={2} alignment="center">
            <AppText variant="title">{displayName}</AppText>
            <AppText variant="caption" tone="muted">
              {profile.email ?? ""}
            </AppText>
            <AppText variant="caption" tone="muted">
              {profile.progression.provisional
                ? "Elo provisoire"
                : `Elo ${formatNumber(profile.progression.rating)}`}
            </AppText>
          </Column>
          <Row spacing={8} alignment="center">
            <AppChip label={`${profile.followingCount} abonnements`} />
            <AppChip label={`${profile.followersCount} abonnés`} />
            {profile.premium ? <AppChip label="Premium" selected /> : null}
            {rewardsCount > 0 ? (
              <AppChip label={`${rewardsCount} récompenses`} />
            ) : null}
            {demo ? <AppChip label="Démo" selected /> : null}
          </Row>
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

      <Section title="Réglages">
        <Column spacing={2}>
          <AppRow
            icon="settings"
            title="Préférences"
            subtitle="Apparence et notifications"
            onPress={() => router.push("/settings")}
          />
        </Column>
      </Section>

      <Section title="Compte">
        <Column spacing={2}>
          <AppRow
            icon="logout"
            title="Se déconnecter"
            subtitle={profile.email ?? undefined}
            onPress={() => {
              void logout();
            }}
          />
        </Column>
      </Section>
    </Screen>
  );
}
