import { useRouter } from "expo-router";

import { useContentWidth } from "@/hooks/use-content-width";

import {
  AppAvatar,
  AppCard,
  AppImage,
  AppChip,
  AppRow,
  AppText,
  Carousel,
  Column,
  Grid,
  Row,
  Screen,
  Section,
  Spacer,
} from "@/components";
import { useAuth } from "@/features/auth";
import { useMe } from "@/features/profile/hooks/use-me";
import { usePlayerTitles } from "@/features/profile/hooks/use-player-titles";
import { useRewards } from "@/features/profile/hooks/use-rewards";
import { rewardDescription, rewardLabel } from "@/features/profile/domain/reward-labels";
import { masteryGradeLabel } from "@/features/topics/domain/mastery";
import { topicName } from "@/features/topics/domain/topic";
import { isMockAuth, isMockData } from "@/lib/config";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { formatNumber } from "@/shared/utils/format";

export function ProfilePage() {
  const router = useRouter();
  const width = useContentWidth();
  const me = useMe();
  const titles = usePlayerTitles(me.data?.userId);
  const rewards = useRewards();
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
  const unlockedTitles = titles.data?.titles ?? [];
  const rewardItems = rewards.data?.rewards ?? [];

  return (
    <Screen
      tabBar
      refreshing={me.isRefetching}
      onRefresh={() => void me.refetch()}
    >
      {profile.bannerUrl ? (
        <AppImage
          source={{ uri: profile.bannerUrl }}
          width={width}
          height={150}
          radius={18}
          accessibilityLabel="Bannière de profil"
        />
      ) : null}

      <Section>
        <Column spacing={10} alignment="center">
          <AppAvatar
            name={displayName}
            userId={profile.userId}
            avatarOptions={profile.avatarOptions}
            size={84}
          />
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
          <Carousel
            items={[
              { id: "following", label: `${profile.followingCount} abonnements` },
              { id: "followers", label: `${profile.followersCount} abonnés` },
              ...(profile.premium
                ? [{ id: "premium", label: "Premium", selected: true }]
                : []),
              ...(rewardsCount > 0
                ? [{ id: "rewards", label: `${rewardsCount} récompenses` }]
                : []),
              ...(demo
                ? [{ id: "demo", label: "Démo", selected: true }]
                : []),
            ]}
            renderItem={(item) => (
              <AppChip label={item.label} selected={item.selected} />
            )}
          />
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

      <Section title="Titres" action={`${unlockedTitles.length}`}>
        {titles.isLoading ? (
          <AppText variant="caption" tone="muted">
            Chargement des titres…
          </AppText>
        ) : unlockedTitles.length === 0 ? (
          <EmptyState
            title="Aucun titre débloqué"
            subtitle="Atteins un grade de maîtrise dans un sujet pour débloquer son titre."
          />
        ) : (
          <Column spacing={8}>
            {unlockedTitles.slice(0, 4).map((title) => {
              const name = topicName(
                title.topic.names,
                profile.language,
                title.topicId,
              );
              const equipped = titles.data?.equippedKey === title.key;
              return (
                <AppCard key={title.key}>
                  <Row spacing={12} alignment="center">
                    <AppText variant="heading">
                      {title.topic.emoji ?? "🏅"}
                    </AppText>
                    <Column spacing={2}>
                      <AppText variant="label">
                        {`${masteryGradeLabel(title.grade)} · ${name}`}
                      </AppText>
                      <AppText variant="caption" tone="muted">
                        {`${formatNumber(title.gradeRemainingXp)} XP avant le grade suivant`}
                      </AppText>
                    </Column>
                    <Spacer flexible />
                    {equipped ? (
                      <AppChip label="Porté" selected />
                    ) : null}
                  </Row>
                </AppCard>
              );
            })}
          </Column>
        )}
      </Section>

      <Section title="Récompenses" action={`${rewardItems.filter((reward) => reward.unlocked).length}/${rewardItems.length}`}>
        {rewards.isLoading ? (
          <AppText variant="caption" tone="muted">
            Chargement des récompenses…
          </AppText>
        ) : rewardItems.length === 0 ? (
          <EmptyState
            title="Catalogue indisponible"
            subtitle="Les récompenses seront bientôt disponibles."
          />
        ) : (
          <Column spacing={8}>
            {rewardItems.map((reward) => (
              <AppCard key={reward.code}>
                <Row spacing={12} alignment="center">
                  <AppChip
                    label={reward.unlocked ? "Débloquée" : "Verrouillée"}
                    selected={reward.unlocked}
                  />
                  <Column spacing={2}>
                    <AppText variant="label">
                      {rewardLabel(reward.code)}
                    </AppText>
                    <AppText variant="caption" tone="muted">
                      {reward.unlocked
                        ? `Débloquée${
                            reward.unlockedAt
                              ? ` le ${new Date(
                                  reward.unlockedAt,
                                ).toLocaleDateString("fr-FR")}`
                              : ""
                          }`
                        : rewardDescription(reward.code) ??
                          `Badge requis : ${reward.condition.badgeLabel}`}
                    </AppText>
                  </Column>
                </Row>
              </AppCard>
            ))}
          </Column>
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
