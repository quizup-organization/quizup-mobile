import { Column } from "@expo/ui";
import type { ReactNode } from "react";

import { useThemeColor } from "@/hooks/use-theme-color";

/** Surface secondaire du template (`codeHighlightContainer`). */
const surfaceColor = {
  light: "rgba(0,0,0,0.05)",
  dark: "rgba(255,255,255,0.05)",
};

/** Carte de contenu : surface du template, sans bordure. */
export function AppCard({
  children,
  onPress,
  width,
}: {
  children: ReactNode;
  onPress?: () => void;
  width?: number;
}) {
  const background = useThemeColor(surfaceColor, "background");

  return (
    <Column
      spacing={8}
      onPress={onPress}
      style={{
        width,
        padding: 15,
        backgroundColor: background,
        borderRadius: 3,
      }}
    >
      {children}
    </Column>
  );
}
