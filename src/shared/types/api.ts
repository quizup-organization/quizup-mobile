/** Contrats transverses de la surface BFF : pagination et erreur HTTP. */

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/** Réponse d'une commande de création (`IdResponse`). */
export interface IdResponse {
  id: string;
}

/** Enveloppe d'un événement de domaine (historique REST ou push temps réel). */
export interface EventEnvelope<T> {
  aggregateId: string;
  sequenceNumber: number;
  timestamp: string;
  eventType: string;
  payload: T;
}

export class ApiError extends Error {
  readonly statusCode: number;
  readonly type?: string;
  readonly detail?: string;

  constructor(
    message: string,
    options: { statusCode?: number; type?: string; detail?: string } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = options.statusCode ?? 500;
    this.type = options.type;
    this.detail = options.detail;
  }
}
