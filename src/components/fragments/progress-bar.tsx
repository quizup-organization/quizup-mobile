import { Column, Row } from "@expo/ui";

import { useScreenWidth } from "@/components/screen";
import { useNativeColors } from "@/theme";

/** Marge interne d'une carte, pour que la barre remplisse la surface. */
const CARD_PADDING = 15;

/** Barre de progression composée (Expo UI n'expose pas de Progress universel). */
export function ProgressBar({
  value,
  width,
}: {
  value: number;
  width?: number;
}) {
  const colors = useNativeColors();
  const screenWidth = useScreenWidth();
  const total = width ?? screenWidth - CARD_PADDING * 2;
  const filled = Math.max(
    4,
    Math.round(total * Math.min(1, Math.max(0, value))),
  );

  return (
    <Row
      style={{
        width: total,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.fill,
      }}
    >
      <Column
        style={{
          width: filled,
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.accent,
        }}
      />
    </Row>
  );
}
