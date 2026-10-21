import { Column, Row } from "@expo/ui";

import { useThemeColor } from "@/hooks/use-theme-color";

const trackColor = {
  light: "#eee",
  dark: "rgba(255,255,255,0.1)",
};

/** Barre de progression composée (Expo UI n'expose pas de Progress universel). */
export function ProgressBar({ value, width }: { value: number; width: number }) {
  const track = useThemeColor(trackColor, "background");
  const tint = useThemeColor({}, "tint");
  const filled = Math.max(
    4,
    Math.round(width * Math.min(1, Math.max(0, value))),
  );

  return (
    <Row
      style={{
        width,
        height: 8,
        borderRadius: 4,
        backgroundColor: track,
      }}
    >
      <Column
        style={{
          width: filled,
          height: 8,
          borderRadius: 4,
          backgroundColor: tint,
        }}
      />
    </Row>
  );
}
