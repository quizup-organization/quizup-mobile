import { Text } from "@expo/ui";

import { useThemeColor } from "@/hooks/use-theme-color";

/**
 * Échelle typographique interne au composant : elle n'est pas exportée comme un
 * token de thème. Valeurs calées sur les styles du template Expo (titre 20/bold,
 * corps 17/24), le reste étant les tailles nécessaires aux écrans.
 */
export type TextVariant =
  | "display"
  | "title"
  | "heading"
  | "body"
  | "label"
  | "caption";

export type TextTone = "default" | "muted" | "accent" | "onAccent";

const typography = {
  display: { fontSize: 34, fontWeight: "800" },
  title: { fontSize: 20, fontWeight: "700" },
  heading: { fontSize: 17, fontWeight: "600" },
  body: { fontSize: 17, lineHeight: 24, fontWeight: "400" },
  label: { fontSize: 15, fontWeight: "600" },
  caption: { fontSize: 14, lineHeight: 20, fontWeight: "400" },
} as const;

/** Texte secondaire du template Expo (`EditScreenInfo`). */
const mutedColor = {
  light: "rgba(0,0,0,0.8)",
  dark: "rgba(255,255,255,0.8)",
};

const emptyColor = {};

export function AppText({
  children,
  variant = "body",
  tone = "default",
  align,
  numberOfLines,
  onPress,
  width,
}: {
  children: string | number;
  variant?: TextVariant;
  tone?: TextTone;
  align?: "left" | "center" | "right";
  numberOfLines?: number;
  onPress?: () => void;
  width?: number;
}) {
  const color = useThemeColor(
    tone === "muted" ? mutedColor : emptyColor,
    tone === "accent" ? "tint" : tone === "onAccent" ? "background" : "text",
  );

  return (
    <Text
      numberOfLines={numberOfLines}
      onPress={onPress}
      style={width === undefined ? undefined : { width }}
      textStyle={{
        ...typography[variant],
        color,
        textAlign: align,
      }}
    >
      {String(children)}
    </Text>
  );
}
