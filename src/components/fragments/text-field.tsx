import { TextInput } from "@expo/ui";
import type { TextInputProps } from "@expo/ui";

import { useNativeColors } from "@/theme";

/** Champ de saisie universel (SwiftUI TextField / Compose BasicTextField). */
export function AppTextField({
  style,
  textStyle,
  placeholderTextColor,
  ...props
}: TextInputProps) {
  const colors = useNativeColors();

  return (
    <TextInput
      {...props}
      placeholderTextColor={placeholderTextColor ?? colors.textSecondary}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: colors.fill,
        borderRadius: 12,
        ...style,
      }}
      textStyle={{
        fontSize: 17,
        color: colors.text,
        ...textStyle,
      }}
    />
  );
}
