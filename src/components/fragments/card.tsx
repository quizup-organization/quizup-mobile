import { Column } from "@expo/ui";
import type { ReactNode } from "react";

import { interactiveModifiers } from "@/components/fragments/accessibility";
import { useScreenWidth } from "@/components/screen";
import { useNativeColors } from "@/theme";

/** Carte de contenu : surface native, sans bordure. */
export function AppCard({
  children,
  onPress,
  width,
  accessibilityLabel,
  padding = 15,
  radius = 18,
  spacing = 8,
}: {
  children: ReactNode;
  onPress?: () => void;
  width?: number;
  accessibilityLabel?: string;
  padding?: number;
  radius?: number;
  spacing?: number;
}) {
  const colors = useNativeColors();
  const screenWidth = useScreenWidth();

  return (
    <Column
      spacing={spacing}
      onPress={onPress}
      modifiers={
        onPress
          ? interactiveModifiers({ label: accessibilityLabel ?? "Ouvrir" })
          : undefined
      }
      style={{
        width: width ?? screenWidth,
        padding,
        backgroundColor: colors.surface,
        borderRadius: radius,
      }}
    >
      {children}
    </Column>
  );
}
