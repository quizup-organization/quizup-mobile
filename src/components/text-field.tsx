import { TextInput } from "@expo/ui";
import type { TextInputProps } from "@expo/ui";

import { useThemeColor } from "@/hooks/use-theme-color";

/** Surface des champs (`separator` du template). */
const fieldSurface = {
  light: "#eee",
  dark: "rgba(255,255,255,0.1)",
};

/** Champ de saisie universel (SwiftUI TextField / Compose BasicTextField). */
export function AppTextField({
  style,
  textStyle,
  placeholderTextColor,
  ...props
}: TextInputProps) {
  const background = useThemeColor(fieldSurface, "background");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor(
    { light: "rgba(0,0,0,0.8)", dark: "rgba(255,255,255,0.8)" },
    "text",
  );

  return (
    <TextInput
      {...props}
      placeholderTextColor={placeholderTextColor ?? muted}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: background,
        borderRadius: 3,
        ...style,
      }}
      textStyle={{
        fontSize: 17,
        color: text,
        ...textStyle,
      }}
    />
  );
}
