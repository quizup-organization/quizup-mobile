import { Column } from "@expo/ui";

import { useThemeColor } from "@/hooks/use-theme-color";

/** Pastille ronde (compteur, indicateur non-lu). */
export function AppDot({ size = 8 }: { size?: number }) {
  const tint = useThemeColor({}, "tint");

  return (
    <Column
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: tint,
      }}
    />
  );
}
