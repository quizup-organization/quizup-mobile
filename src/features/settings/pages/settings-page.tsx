import {
  AppChip,
  AppSwitch,
  AppText,
  Carousel,
  Column,
  Row,
  Screen,
  Section,
  Spacer,
} from "@/components";
import { useNotificationPreferences, useUpdateNotificationPreference } from "@/features/notifications";
import type { NotificationCategory } from "@/features/notifications";
import { ACCENTS, type AccentOption } from "@/features/settings/domain/accents";
import { useThemeSettings, type ThemeScheme } from "@/providers/theme-provider";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { useNativeColors } from "@/theme";

const SCHEMES: { id: ThemeScheme; label: string }[] = [
  { id: "system", label: "Système" },
  { id: "light", label: "Clair" },
  { id: "dark", label: "Sombre" },
];

const PREFERENCE_LABELS: Record<NotificationCategory, string> = {
  FOLLOW: "Abonnements",
  ROOM: "Salles et défis",
  QUESTION: "Questions",
  ACCOUNT: "Compte",
};

function AccentChip({
  accent,
  selected,
  onPress,
}: {
  accent: AccentOption;
  selected: boolean;
  onPress: () => void;
}) {
  const colors = useNativeColors();

  return (
    <Row
      spacing={6}
      alignment="center"
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 999,
        backgroundColor: selected ? colors.accent : colors.fill,
      }}
    >
      <Column
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: accent.seed ?? colors.textSecondary,
        }}
      />
      <AppText variant="caption" tone={selected ? "onAccent" : "default"}>
        {accent.label}
      </AppText>
    </Row>
  );
}

export function SettingsPage() {
  const { scheme, seed, setScheme, setSeed } = useThemeSettings();
  const preferences = useNotificationPreferences();
  const updatePreference = useUpdateNotificationPreference();

  if (preferences.isLoading) {
    return (
      <Screen>
        <LoadingState label="Chargement des préférences…" />
      </Screen>
    );
  }

  if (preferences.isError) {
    return (
      <Screen>
        <ErrorState
          message="Impossible de charger les préférences."
          onRetry={() => void preferences.refetch()}
        />
      </Screen>
    );
  }

  return (
    <Screen
      refreshing={preferences.isRefetching}
      onRefresh={() => void preferences.refetch()}
    >
      <Section title="Apparence">
        <Column spacing={10}>
          <AppText variant="caption" tone="muted">
            Mode
          </AppText>
          <Carousel
            items={SCHEMES}
            renderItem={(item) => (
              <AppChip
                label={item.label}
                selected={scheme === item.id}
                onPress={() => setScheme(item.id)}
              />
            )}
          />

          <AppText variant="caption" tone="muted">
            Couleur d'accent
          </AppText>
          <Carousel
            items={ACCENTS}
            renderItem={(accent) => (
              <AccentChip
                accent={accent}
                selected={seed === accent.seed}
                onPress={() => setSeed(accent.seed)}
              />
            )}
          />
        </Column>
      </Section>

      <Section title="Notifications">
        <Column spacing={2}>
          {(preferences.data ?? []).map((preference) => (
            <Row
              key={preference.category}
              spacing={12}
              alignment="center"
              style={{ paddingVertical: 8 }}
            >
              <AppText variant="label">
                {PREFERENCE_LABELS[preference.category]}
              </AppText>
              <Spacer flexible />
              <AppSwitch
                value={preference.enabled}
                label={PREFERENCE_LABELS[preference.category]}
                disabled={updatePreference.isPending}
                onValueChange={(enabled) =>
                  updatePreference.mutate({
                    category: preference.category,
                    enabled,
                  })
                }
              />
            </Row>
          ))}
        </Column>
      </Section>
    </Screen>
  );
}
