import { AppCard, AppText, Column, Row, Spacer } from "@/components";
import { useProfileActivity } from "@/features/player/hooks/use-profile-activity";

export function ActivitySummary({
  userId,
  language = "fr",
}: {
  userId: string;
  language?: "fr" | "en";
}) {
  const activity = useProfileActivity(userId);

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
      <AppText variant="caption" tone="muted">
        {language === "fr"
          ? "Joue un peu chaque jour pour entretenir ta série."
          : "Play a little every day to keep your streak alive."}
      </AppText>
    </AppCard>
  );
}
