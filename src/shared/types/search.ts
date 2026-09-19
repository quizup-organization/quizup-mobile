/**
 * Contrat de recherche partagé par tous les endpoints `POST /api/.../search`.
 */

export type FilterOperator =
  | "EQUALS"
  | "NOT_EQUALS"
  | "CONTAINS"
  | "STARTS_WITH"
  | "ENDS_WITH"
  | "IN"
  | "NOT_IN"
  | "GREATER_THAN"
  | "GREATER_OR_EQUAL"
  | "LESS_THAN"
  | "LESS_OR_EQUAL"
  | "BETWEEN"
  | "IS_NULL";

export type SortDirection = "ASC" | "DESC";

export interface FilterCriteria {
  property: string;
  operator: FilterOperator;
  value?: string | number | boolean | null;
  valueTo?: string | number | boolean | null;
  values?: (string | number)[];
}

export interface SortCriteria {
  property: string;
  direction: SortDirection;
}

export interface PageCriteria {
  number: number;
  size: number;
}

export interface SearchRequest {
  filters?: FilterCriteria[];
  sorts?: SortCriteria[];
  page?: PageCriteria;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  sorts: SortCriteria[];
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface IdResponse {
  id: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  title?: string;
  detail?: string;
}
