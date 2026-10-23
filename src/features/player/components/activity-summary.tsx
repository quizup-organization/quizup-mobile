import { AppCard, AppText, Column, Row, Spacer } from "@/components";
import { useNativeColors } from "@/theme";
import { useProfileActivity } from "@/features/player/hooks/use-profile-activity";

export function ActivitySummary({
  userId,
  language = "fr",
}: {
  userId: string;
  language?: "fr" | "en";
}) {
  const activity = useProfileActivity(userId);
  const colors = useNativeColors();

  if (activity.isLoading) {
    return (
      <AppText variant="caption" tone="muted">
        Chargement de l'activité…
      </AppText>
    );
  }

  if (!activity.data) return null;

  return (
    <AppCard>
      <Row spacing={16} alignment="center">
        <Column spacing={2}>
          <AppText variant="heading">
            {`${activity.data.currentStreak} j`}
          </AppText>
          <AppText variant="caption" tone="muted">
            Série actuelle
          </AppText>
        </Column>
        <Spacer flexible />
        <Column spacing={2}>
          <AppText variant="heading">
            {`${activity.data.longestStreak} j`}
          </AppText>
          <AppText variant="caption" tone="muted">
            Record
          </AppText>
        </Column>
        <Spacer flexible />
        <Column spacing={2}>
          <AppText variant="heading">
            {`${activity.data.totalActiveDays}`}
          </AppText>
          <AppText variant="caption" tone="muted">
            Jours actifs
          </AppText>
        </Column>
      </Row>
      <Row spacing={4} alignment="end">
        {[...activity.data.days]
          .slice(0, 14)
          .reverse()
          .map((day) => (
            <Column
              key={day.date}
              style={{
                width: 10,
                height: 6 + Math.min(day.games, 5) * 5,
                borderRadius: 3,
                backgroundColor:
                  day.games > 0 ? colors.accent : colors.fill,
              }}
            />
          ))}
      </Row>
      <AppText variant="caption" tone="muted">
        {language === "fr"
          ? "Joue un peu chaque jour pour entretenir ta série."
          : "Play a little every day to keep your streak alive."}
      </AppText>
    </AppCard>
  );
}
