import { Column, Row, Spacer } from "@expo/ui";
import type { ReactNode } from "react";

import { Block } from "@/components/block";
import { AppText } from "@/components/text";

/** Bloc titré (section d'écran). */
export function Section({
  title,
  action,
  children,
}: {
  title?: string;
  action?: string;
  children: ReactNode;
}) {
  return (
    <Block>
      <Column spacing={12}>
        {title ? (
          <Row spacing={8} alignment="center">
            <AppText variant="heading">{title}</AppText>
            <Spacer flexible />
            {action ? (
              <AppText variant="caption" tone="muted">
                {action}
              </AppText>
            ) : null}
          </Row>
        ) : null}
        {children}
      </Column>
    </Block>
  );
}
