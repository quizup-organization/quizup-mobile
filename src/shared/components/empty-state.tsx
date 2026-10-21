import { AppText, Column } from "@/components";

export function EmptyState({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <Column spacing={6} alignment="center" style={{ paddingVertical: 32 }}>
      <AppText variant="heading" align="center">
        {title}
      </AppText>
      {subtitle ? (
        <AppText variant="caption" tone="muted" align="center">
          {subtitle}
        </AppText>
      ) : null}
    </Column>
  );
}
