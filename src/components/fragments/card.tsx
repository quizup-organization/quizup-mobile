import { Column } from "@expo/ui";
import type { ReactNode } from "react";

import { useScreenWidth } from "@/components/screen";
import { useNativeColors } from "@/theme";

/** Carte de contenu : surface native, sans bordure. */
export function AppCard({
  children,
  onPress,
  width,
}: {
  children: ReactNode;
  onPress?: () => void;
  width?: number;
}) {
  const colors = useNativeColors();
  const screenWidth = useScreenWidth();

  return (
    <Column
      spacing={8}
      onPress={onPress}
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
