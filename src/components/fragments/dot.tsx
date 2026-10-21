import { Column } from "@expo/ui";

import { useNativeColors } from "@/theme";

/** Pastille ronde (compteur, indicateur non-lu). */
export function AppDot({ size = 8 }: { size?: number }) {
  const colors = useNativeColors();

  return (
    <Column
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.accent,
      }}
    />
  );
}
