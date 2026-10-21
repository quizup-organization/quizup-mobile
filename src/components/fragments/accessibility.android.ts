import { semantics } from "@expo/ui/jetpack-compose/modifiers";

/** Élément interactif : TalkBack annonce le libellé complet. */
export function interactiveModifiers({
  label,
  selected,
}: {
  label: string;
  selected?: boolean;
}) {
  return [
    semantics({
      contentDescription: selected ? `${label}, sélectionné` : label,
    }),
  ];
}

/** Android n'expose pas de masquage décoratif simple via `semantics`. */
export function decorativeModifiers() {
  return [];
}

/** Barre de progression : TalkBack annonce le libellé et le pourcentage. */
export function progressModifiers(label: string, percent: number) {
  return [semantics({ contentDescription: `${label}, ${percent} %` })];
}
