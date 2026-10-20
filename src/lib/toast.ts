export type ToastTone = "default" | "success" | "danger";

export interface ToastInput {
  title: string;
  description?: string;
  tone?: ToastTone;
}

type ToastHandler = (toast: ToastInput) => void;

let handler: ToastHandler | null = null;

/** Point d'entrée impératif pour les hooks de données (hors composant HeroUI). */
export function setToastHandler(next: ToastHandler | null): void {
  handler = next;
}

export function showToast(toast: ToastInput): void {
  handler?.(toast);
}
