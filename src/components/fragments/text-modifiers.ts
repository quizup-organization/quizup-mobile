import {
  font,
  accessibilityAddTraits,
} from "@expo/ui/swift-ui/modifiers";

import type { TextVariant } from "@/components/fragments/text";

/**
 * Styles de texte natifs iOS : ils suivent le réglage Dynamic Type.
 * Android utilise des `sp` (déjà adaptatifs), d'où l'override `.android.ts`.
 */
const textStyles = {
  display: { textStyle: "largeTitle", weight: "bold" },
  title: { textStyle: "title3", weight: "bold" },
  heading: { textStyle: "headline" },
  body: { textStyle: "body" },
  label: { textStyle: "subheadline", weight: "semibold" },
  caption: { textStyle: "footnote" },
} as const;

export function textModifiers(variant: TextVariant) {
  const modifiers = [font(textStyles[variant])];

  if (variant === "title" || variant === "heading") {
    modifiers.push(accessibilityAddTraits(["isHeader"]));
  }

  return modifiers;
}
