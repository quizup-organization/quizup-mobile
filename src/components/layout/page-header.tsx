import { Column, Row } from "@expo/ui";
import type { ReactNode } from "react";

import { useScreenWidth } from "@/components/screen";
import { AppText } from "@/components/fragments/text";

/** En-tête d'écran : titre, sous-titre et contenu optionnel (chips…). */
export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  const width = useScreenWidth();

  return (
    <Column spacing={8} style={{ width }}>
      <AppText variant="title" width={width}>
        {title}
      </AppText>
      {subtitle ? (
        <AppText variant="body" tone="muted" width={width}>
          {subtitle}
        </AppText>
      ) : null}
      {children ? (
        <Row spacing={8} alignment="center">
          {children}
        </Row>
      ) : null}
    </Column>
  );
}
