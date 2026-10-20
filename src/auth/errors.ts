/** Erreur métier renvoyée par identity (ProblemDetail ou erreur OAuth2). */
export class AuthError extends Error {
  constructor(
    readonly status: number,
    readonly type: string | undefined,
    message: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

/** L'utilisateur a annulé le sélecteur natif Google/Facebook. */
export class AuthCancelledError extends Error {
  constructor() {
    super("Authentication cancelled");
    this.name = "AuthCancelledError";
  }
}

export function isFacebookEmailMissing(error: unknown): boolean {
  return (
    error instanceof AuthError &&
    (error.status === 422 ||
      error.type?.endsWith("facebookEmailMissing") === true)
  );
}
