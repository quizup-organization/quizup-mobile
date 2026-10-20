/* ---------- Utilitaires partagés ---------- */

export const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

export const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const clamp = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, v));

export const compactNumber = (n: number): string =>
    n >= 1000000
        ? (n / 1000000).toFixed(1).replace(".", ",").replace(",0", "") + " M"
        : n >= 1000
            ? Math.round(n / 1000) + " k"
            : String(n);

/** Normalisation sans accent ni casse, partagée par la recherche et les identifiants. */
export const normalize = (s: string): string =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export const slugify = (s: string): string =>
    normalize(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Hash stable et déterministe — sert à dériver des stats mock à partir d'un nom. */
export const hashString = (s: string): number => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return Math.abs(h);
};
