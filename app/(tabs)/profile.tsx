import {
  AppAvatar,
  AppCard,
  AppChip,
  AppRow,
  AppText,
  Column,
  Grid,
  ProgressBar,
  Row,
  Screen,
  Section,
  Spacer,
} from "@/components";
import { useAuth } from "@/auth/AuthProvider";
import { profile } from "@/data/fixtures";

export default function ProfileScreen() {
  const { session, logout } = useAuth();
  const progress = profile.xp / profile.xpToNext;

  return (
    <Screen>
      <Section>
        <Column spacing={10} alignment="center">
          <AppAvatar initials={profile.initials} size={76} />
          <Column spacing={2} alignment="center">
            <AppText variant="title">{profile.name}</AppText>
            {session?.email ? (
              <AppText variant="caption" tone="muted">
                {session.email}
              </AppText>
            ) : null}
            <AppText variant="caption" tone="muted">
              {`Niveau ${profile.level} · ${profile.title}`}
            </AppText>
          </Column>
          <Row spacing={8} alignment="center">
            <AppChip label="Explorateur" icon="medal" selected />
            <AppChip label="Série 5 j" icon="fire" />
          </Row>
        </Column>
      </Section>

      <Section>
        <AppCard>
          <Row spacing={8} alignment="center">
            <AppText variant="label">Progression</AppText>
            <Spacer flexible />
            <AppText variant="caption" tone="muted">
              {`${profile.xp.toLocaleString("fr-FR")} / ${profile.xpToNext.toLocaleString("fr-FR")} XP`}
            </AppText>
          </Row>
          <Row alignment="center">
            <ProgressBar value={progress} />
          </Row>
          <AppText variant="caption" tone="muted">
            {`Encore ${(profile.xpToNext - profile.xp).toLocaleString("fr-FR")} XP pour le niveau ${profile.level + 1}.`}
          </AppText>
        </AppCard>
      </Section>

      <Grid
        items={profile.stats}
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
        <Row spacing={8} alignment="center">
          {profile.badges.map((badge) => (
            <AppChip key={badge.id} label={badge.label} icon={badge.icon} />
          ))}
        </Row>
      </Section>

      <Section title="Réglages">
        <Column spacing={2}>
          <AppRow
            icon="settings"
            title="Préférences"
            subtitle="Thème, langue, notifications"
            onPress={() => {}}
          />
          <AppRow
            icon="medal"
            title="Récompenses"
            subtitle="Titres et badges obtenus"
            onPress={() => {}}
          />
          <AppRow
            icon="trend"
            title="Statistiques"
            subtitle="Historique de tes parties"
            onPress={() => {}}
          />
        </Column>
      </Section>

      <Section title="Compte">
        <Column spacing={2}>
          <AppRow
            icon="logout"
            title="Se déconnecter"
            subtitle={session?.email}
            onPress={() => {
              void logout();
            }}
          />
        </Column>
      </Section>
    </Screen>
  );
}
