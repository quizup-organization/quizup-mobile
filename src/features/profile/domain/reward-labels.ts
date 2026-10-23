/** Libellés courts des récompenses du catalogue profile. */
const REWARD_LABELS: Record<
  string,
  { title: string; description: string }
> = {
  MICAH_AVATAR: {
    title: "Avatar Micah",
    description: "Le style d'avatar historique de QuizUp.",
  },
  LORELEI_AVATAR: {
    title: "Avatar Lorelei",
    description: "Un style illustré supplémentaire.",
  },
  NOTIONISTS_AVATAR: {
    title: "Avatar Notionists",
    description: "Un style d'avatar rare pour les experts.",
  },
};

export function rewardLabel(code: string): string {
  return REWARD_LABELS[code]?.title ?? code;
}

export function rewardDescription(code: string): string | null {
  return REWARD_LABELS[code]?.description ?? null;
}
