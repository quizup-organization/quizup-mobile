import { Text } from "@expo/ui";

import { textModifiers } from "@/components/fragments/text-modifiers";
import { useNativeColors } from "@/theme";

/**
 * Échelle typographique interne au composant : elle n'est pas exportée comme un
 * token de thème. Sur iOS, `textModifiers` remplace ces tailles par les styles
 * natifs Dynamic Type ; sur Android, les valeurs sont converties en `sp` et
 * suivent le font scale système.
 */
export type TextVariant =
  | "display"
  | "title"
  | "heading"
  | "body"
  | "label"
  | "caption";

export type TextTone =
  | "default"
  | "muted"
  | "accent"
  | "onAccent"
  | "danger";

const typography = {
  display: { fontSize: 34, fontWeight: "800" },
  title: { fontSize: 20, fontWeight: "700" },
  heading: { fontSize: 17, fontWeight: "600" },
  body: { fontSize: 17, fontWeight: "400" },
  label: { fontSize: 15, fontWeight: "600" },
  caption: { fontSize: 14, fontWeight: "400" },
} as const;

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
  const colors = useNativeColors();
  const color =
    tone === "muted"
      ? colors.textSecondary
      : tone === "accent"
        ? colors.accent
        : tone === "onAccent"
          ? colors.onAccent
          : tone === "danger"
            ? colors.danger
            : colors.text;

  return (
    <Text
      numberOfLines={numberOfLines}
      onPress={onPress}
      modifiers={textModifiers(variant)}
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
