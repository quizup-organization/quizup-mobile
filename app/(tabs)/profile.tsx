import { Column, Row, Spacer } from "@expo/ui";
import { useWindowDimensions } from "react-native";
import { profile } from "@/data/fixtures";
import {
  AppAvatar,
  AppBar,
  AppChip,
  AppRow,
  AppText,
  Block,
  Screen,
  Section,
} from "@/ui/primitives";
import { radius, useColors } from "@/ui/theme";

export default function ProfileScreen() {
  const { width } = useWindowDimensions();
  const c = useColors();

  const contentWidth = Math.min(width - 40, 480);
  const statWidth = Math.floor((contentWidth - 20) / 3);
  const progress = profile.xp / profile.xpToNext;

  return (
    <Screen>
      <Block>
        <Column spacing={10} alignment="center">
          <AppAvatar initials={profile.initials} size={76} />
          <Column spacing={2} alignment="center">
            <AppText variant="title">{profile.name}</AppText>
            <AppText variant="caption" tone="muted">
              {`Niveau ${profile.level} · ${profile.title}`}
            </AppText>
          </Column>
          <Row spacing={8} alignment="center">
            <AppChip label="Explorateur" icon="medal" selected />
            <AppChip label="Série 5 j" icon="fire" />
          </Row>
        </Column>
      </Block>

      <Block>
        <Column
          spacing={10}
          style={{
            padding: 16,
            backgroundColor: c.surface,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: c.border,
          }}
        >
          <Row spacing={8} alignment="center">
            <AppText variant="label">Progression</AppText>
            <Spacer flexible />
            <AppText variant="caption" tone="muted">
              {`${profile.xp.toLocaleString("fr-FR")} / ${profile.xpToNext.toLocaleString("fr-FR")} XP`}
            </AppText>
          </Row>
          <Row alignment="center">
            <AppBar value={progress} width={contentWidth - 32} />
          </Row>
          <AppText variant="caption" tone="muted">
            {`Encore ${(profile.xpToNext - profile.xp).toLocaleString("fr-FR")} XP pour le niveau ${profile.level + 1}.`}
          </AppText>
        </Column>
      </Block>

      <Block>
        <Row spacing={10}>
          {profile.stats.map((stat) => (
            <Column
              key={stat.label}
              spacing={4}
              style={{
                width: statWidth,
                padding: 14,
                backgroundColor: c.surface,
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: c.border,
              }}
            >
              <AppText variant="heading">{stat.value}</AppText>
              <AppText variant="caption" tone="muted">
                {stat.label}
              </AppText>
            </Column>
          ))}
        </Row>
      </Block>

      <Section title="Badges">
        <Row spacing={8} alignment="center">
          {profile.badges.map((badge) => (
            <AppChip key={badge.id} label={badge.label} icon={badge.icon} />
          ))}
        </Row>
      </Section>

      <Section title="Réglages">
        <Column spacing={2}>
          <AppRow icon="settings" title="Préférences" subtitle="Thème, langue, notifications" onPress={() => {}} />
          <AppRow icon="medal" title="Récompenses" subtitle="Titres et badges obtenus" onPress={() => {}} />
          <AppRow icon="trend" title="Statistiques" subtitle="Historique de tes parties" onPress={() => {}} />
        </Column>
      </Section>
    </Screen>
  );
}
