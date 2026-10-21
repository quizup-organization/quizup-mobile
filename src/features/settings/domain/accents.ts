export interface AccentOption {
  id: string;
  label: string;
  seed?: string;
}

/** Palette d'accents proposée dans les réglages (seed natif du Host). */
export const ACCENTS: AccentOption[] = [
  { id: "system", label: "Système" },
  { id: "indigo", label: "Indigo", seed: "#4F46E5" },
  { id: "blue", label: "Bleu", seed: "#0A84FF" },
  { id: "green", label: "Vert", seed: "#16A34A" },
  { id: "orange", label: "Orange", seed: "#F97316" },
  { id: "pink", label: "Rose", seed: "#DB2777" },
];
