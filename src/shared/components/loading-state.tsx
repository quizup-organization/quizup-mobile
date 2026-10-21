import { AppText, Column } from "@/components";

export function LoadingState({ label = "Chargement…" }: { label?: string }) {
  return (
    <Column spacing={8} alignment="center" style={{ paddingVertical: 32 }}>
      <AppText variant="body" tone="muted" align="center">
        {label}
      </AppText>
    </Column>
  );
}
