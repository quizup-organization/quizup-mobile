import { Button } from "@expo/ui";
import type { UniversalStyle } from "@expo/ui";
import type { ReactNode } from "react";

export function AppButton({
  label,
  onPress,
  variant = "filled",
  disabled,
  style,
  children,
}: {
  label?: string;
  onPress?: () => void;
  variant?: "filled" | "outlined" | "text";
  disabled?: boolean;
  style?: UniversalStyle;
  children?: ReactNode;
}) {
  return (
    <Button
      label={label}
      onPress={onPress}
      variant={variant}
      disabled={disabled}
      style={style}
    >
      {children}
    </Button>
  );
}
