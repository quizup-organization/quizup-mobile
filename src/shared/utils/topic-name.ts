import type { Language, TopicNames } from "@/shared/types/bff";

/**
 * Résout le nom d'un sujet dans la langue demandée : langue → FR → EN → première valeur.
 * Miroir de la résolution backend (`Language`, FR de référence).
 */
export function topicName(
  names: TopicNames | null | undefined,
  language: Language,
  fallback = "Sujet",
): string {
  if (!names) return fallback;
  return (
    names[language] ??
    names.fr ??
    names.en ??
    Object.values(names)[0] ??
    fallback
  );
}
