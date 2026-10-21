import { AppButton, AppText, Column } from "@/components";

export function ErrorState({
  message = "Impossible de charger les données.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <Column spacing={12} alignment="center" style={{ paddingVertical: 32 }}>
      <AppText variant="body" tone="muted" align="center">
        {message}
      </AppText>
      {onRetry ? (
        <AppButton label="Réessayer" variant="outlined" onPress={onRetry} />
      ) : null}
    </Column>
  );
}
