import { Column } from "@expo/ui";

import { decorativeModifiers } from "@/components/fragments/accessibility";
import { useNativeColors } from "@/theme";

/** Pastille ronde (compteur, indicateur non-lu). */
export function AppDot({ size = 8 }: { size?: number }) {
  const colors = useNativeColors();

  return (
    <Column
      modifiers={decorativeModifiers()}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.accent,
      }}
    />
  );
}
