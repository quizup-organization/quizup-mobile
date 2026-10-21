import { Switch } from "@expo/ui";

/** Interrupteur natif (SwiftUI Switch / Compose Switch). */
export function AppSwitch({
  value,
  onValueChange,
  disabled,
}: {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange ?? (() => {})}
      disabled={disabled}
    />
  );
}
