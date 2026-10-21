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
}: {
  children: ReactNode;
  onPress?: () => void;
  width?: number;
  accessibilityLabel?: string;
}) {
  const colors = useNativeColors();
  const screenWidth = useScreenWidth();

  return (
    <Column
      spacing={8}
      onPress={onPress}
      modifiers={
        onPress
          ? interactiveModifiers({ label: accessibilityLabel ?? "Ouvrir" })
          : undefined
      }
      style={{
        width: width ?? screenWidth,
        padding: 15,
        backgroundColor: colors.surface,
        borderRadius: 3,
      }}
    >
      {children}
    </Column>
  );
}
