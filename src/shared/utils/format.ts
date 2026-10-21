/** Initiales d'un nom ou d'un email (avatar de repli). */
export function initials(name: string): string {
  const cleaned = name.trim();
  if (!cleaned) return "?";
  const parts = cleaned.split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

export function formatNumber(value: number): string {
  return value.toLocaleString("fr-FR");
}

export function formatPercent(value: number): string {
  return `${Math.round(value)} %`;
}
