/**
 * Grades de maîtrise d'un sujet (`MasteryGrade` backend) et libellés FR.
 * Le serveur n'envoie jamais le libellé composé : le client combine le grade et le sujet.
 */
export const MASTERY_GRADES = [
  "NOVICE",
  "APPRENTI",
  "PRATIQUANT",
  "CONFIRME",
  "EXPERT",
  "MAITRE",
  "LEGENDE",
] as const;

export type MasteryGrade = (typeof MASTERY_GRADES)[number];

const MASTERY_GRADE_LABELS: Record<MasteryGrade, string> = {
  NOVICE: "Novice",
  APPRENTI: "Apprenti",
  PRATIQUANT: "Pratiquant",
  CONFIRME: "Confirmé",
  EXPERT: "Expert",
  MAITRE: "Maître",
  LEGENDE: "Légende",
};

export function masteryGradeLabel(grade: string | null | undefined): string {
  if (!grade) return "Novice";
  return (
    MASTERY_GRADE_LABELS[grade as MasteryGrade] ??
    grade.charAt(0) + grade.slice(1).toLowerCase()
  );
}

/** Rang de maîtrise 0-based (pour une frise éventuelle). */
export function masteryGradeIndex(grade: string | null | undefined): number {
  if (!grade) return 0;
  const index = MASTERY_GRADES.indexOf(grade as MasteryGrade);
  return index >= 0 ? index : 0;
}
