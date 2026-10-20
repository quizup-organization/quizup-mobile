/** Session QuizUp persistée dans le stockage sécurisé du téléphone. */
export type Session = {
  userId: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  /** Timestamp epoch (ms) de l'expiration de l'access token. */
  expiresAt: number;
};

export type LoginResponse = {
  userId: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
};

export type FacebookCredentials =
  | { idToken: string; nonce: string }
  | { accessToken: string };

export type ProblemDetail = {
  type?: string;
  title?: string;
  detail?: string;
  status?: number;
  error?: string;
  error_description?: string;
};
