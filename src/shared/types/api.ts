/** Contrats HTTP transverses de la surface BFF. */

export interface IdResponse {
  id: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  title?: string;
  detail?: string;
  /** URI d'identification du problème RFC 7807 (ex. `urn:quizup:challenge:…`). */
  type?: string;
}
