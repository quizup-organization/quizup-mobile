import { Column, Row, Spacer } from "@expo/ui";
import type { ReactNode } from "react";

import { useScreenWidth } from "@/components/screen";
import { AppText } from "@/components/fragments/text";

/** Section d'écran : titre optionnel, action et contenu natif. */
export function Section({
  title,
  action,
  onAction,
  children,
}: {
  title?: string;
  action?: string;
  onAction?: () => void;
  children: ReactNode;
}) {
  const width = useScreenWidth();

  return (
    <Column spacing={12} style={{ width }}>
      {title ? (
        <Row spacing={8} alignment="center">
          <AppText variant="heading">{title}</AppText>
          <Spacer flexible />
          {action ? (
            <AppText
              variant="caption"
              tone={onAction ? "accent" : "muted"}
              onPress={onAction}
            >
              {action}
            </AppText>
          ) : null}
        </Row>
      ) : null}
      {children}
    </Column>
  );
}
