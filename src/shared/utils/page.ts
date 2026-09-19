import type { PageResponse } from "@/shared/types/search";

/** Construit une `PageResponse` d'un seul élément (mise à jour optimiste du cache). */
export function pageOf<T>(item: T): PageResponse<T> {
  return {
    content: [item],
    pageNumber: 0,
    pageSize: 1,
    totalElements: 1,
    totalPages: 1,
    sorts: [],
    first: true,
    last: true,
    empty: false,
  };
}

/** `PageResponse` vide. */
export function emptyPage<T>(): PageResponse<T> {
  return {
    content: [],
    pageNumber: 0,
    pageSize: 1,
    totalElements: 0,
    totalPages: 0,
    sorts: [],
    first: true,
    last: true,
    empty: true,
  };
}
