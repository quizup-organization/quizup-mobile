import {
  accessibilityAddTraits,
  accessibilityElement,
  accessibilityHidden,
  accessibilityLabel,
  accessibilityValue,
} from "@expo/ui/swift-ui/modifiers";

/** Élément interactif : un seul élément VoiceOver, avec libellé et trait. */
export function interactiveModifiers({
  label,
  selected,
}: {
  label: string;
  selected?: boolean;
}) {
  return [
    accessibilityElement("ignore"),
    accessibilityLabel(label),
    accessibilityAddTraits(
      selected ? ["isButton", "isSelected"] : ["isButton"],
    ),
  ];
}

/** Élément purement décoratif (icône, pastille, initiales). */
export function decorativeModifiers() {
  return [accessibilityHidden(true)];
}

/** Barre de progression : libellé + valeur annoncée. */
export function progressModifiers(label: string, percent: number) {
  return [
    accessibilityElement("ignore"),
    accessibilityLabel(label),
    accessibilityValue(`${percent} %`),
  ];
}

/** Interrupteur : libellé + état annoncés. */
export function switchModifiers(label: string, value: boolean) {
  return [
    accessibilityLabel(label),
    accessibilityAddTraits(["isToggle"]),
    accessibilityValue(value ? "Activé" : "Désactivé"),
  ];
}
