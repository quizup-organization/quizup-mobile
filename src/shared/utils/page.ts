import type { Page } from "@/shared/types/api";

/** Construit une page de mock cohérente avec le contrat BFF. */
export function toPage<T>(content: T[], page = 0, size = 20): Page<T> {
  const totalElements = content.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const start = page * size;

  return {
    content: content.slice(start, start + size),
    page,
    size,
    totalElements,
    totalPages,
    first: page === 0,
    last: page >= totalPages - 1,
  };
}
