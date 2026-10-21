import type { TextVariant } from "@/components/fragments/text";

/**
 * Android : les tailles de `Text` sont converties en `sp` par Expo UI et
 * suivent donc déjà le font scale système. Aucun modifier supplémentaire.
 */
export function textModifiers(_variant: TextVariant) {
  return [];
}
