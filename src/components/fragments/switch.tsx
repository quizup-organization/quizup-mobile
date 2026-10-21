import { Switch } from "@expo/ui";

import { switchModifiers } from "@/components/fragments/accessibility";

/** Interrupteur natif (SwiftUI Switch / Compose Switch). */
export function AppSwitch({
  value,
  onValueChange,
  disabled,
  label = "Interrupteur",
}: {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange ?? (() => {})}
      disabled={disabled}
      modifiers={switchModifiers(label, value)}
    />
  );
}
