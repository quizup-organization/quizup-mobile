import { Column, Row } from "@expo/ui";

import { progressModifiers } from "@/components/fragments/accessibility";
import { useScreenWidth } from "@/components/screen";
import { useNativeColors } from "@/theme";

/** Marge interne d'une carte, pour que la barre remplisse la surface. */
const CARD_PADDING = 15;

/** Barre de progression composée (Expo UI n'expose pas de Progress universel). */
export function ProgressBar({
  value,
  width,
  label = "Progression",
}: {
  value: number;
  width?: number;
  label?: string;
}) {
  const colors = useNativeColors();
  const screenWidth = useScreenWidth();
  const total = width ?? screenWidth - CARD_PADDING * 2;
  const safeValue = Math.min(1, Math.max(0, value));
  const filled = Math.max(4, Math.round(total * safeValue));

  return (
    <Row
      modifiers={progressModifiers(label, Math.round(safeValue * 100))}
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
