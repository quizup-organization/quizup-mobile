/** Libellés français des grades de maîtrise (`MasteryGrade`). */
const GRADE_LABELS: Record<string, string> = {
  APPRENTI: "Apprenti",
  PRATIQUANT: "Praticien",
  CONFIRME: "Confirmé",
  EXPERT: "Expert",
  MAITRE: "Maître",
};

export function masteryGradeLabel(grade: string | null | undefined): string {
  if (!grade) return "Non classé";
  return GRADE_LABELS[grade] ?? grade;
}
