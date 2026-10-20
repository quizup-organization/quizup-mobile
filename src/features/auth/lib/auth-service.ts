import { ENDPOINTS } from "@/lib/endpoints";
import type { FacebookCredential } from "./facebook";

/** Session mobile retournée par identity (mêmes tokens que le flux OIDC). */
export interface MobileLoginResponse {
  userId: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
}

/** Erreur d'authentification identity, avec le message `detail` prêt à afficher. */
export class IdentityAuthError extends Error {
  readonly status?: number;
  readonly type?: string;

  constructor(message: string, status?: number, type?: string) {
    super(message);
    this.name = "IdentityAuthError";
    this.status = status;
    this.type = type;
  }
}

async function readError(response: Response, fallback: string): Promise<IdentityAuthError> {
  const problem = (await response.json().catch(() => null)) as ProblemDetail | null;
  return new IdentityAuthError(
    problem?.detail ?? problem?.title ?? fallback,
    response.status,
    problem?.type,
  );
}

/** POST JSON vers identity, avec message réseau déjà traduit pour l'écran de login. */
async function postJson(
  url: string,
  body: unknown,
  networkError: string,
): Promise<Response> {
  try {
    return await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new IdentityAuthError(networkError);
  }
}

async function readSession(response: Response): Promise<MobileLoginResponse> {
  const session = (await response.json()) as MobileLoginResponse;
  if (!session.accessToken || !session.refreshToken) {
    throw new IdentityAuthError(
      "Réponse d'authentification incomplète. Réessaie.",
      response.status,
    );
  }
  return session;
}

/**
 * Demande un code de connexion. Identity répond toujours 202 (anti-énumération) : le
 * client passe à l'étape code même si aucun compte n'existe encore.
 */
export async function requestLoginCode(email: string): Promise<void> {
  const response = await postJson(
    ENDPOINTS.auth.requestLoginCode,
    { email: email.trim() },
    "Impossible d'envoyer le code. Vérifie ta connexion et réessaie.",
  );
  if (!response.ok) {
    throw await readError(
      response,
      "Impossible d'envoyer le code. Vérifie ta connexion et réessaie.",
    );
  }
}

/** Vérifie le code OTP et retourne une session mobile (access + refresh tokens). */
export async function loginWithCode(
  email: string,
  code: string,
): Promise<MobileLoginResponse> {
  const response = await postJson(
    ENDPOINTS.auth.loginWithCode,
    { email: email.trim(), code: code.trim() },
    "Connexion impossible. Vérifie ta connexion et réessaie.",
  );
  if (!response.ok) {
    throw await readError(response, "Connexion impossible. Réessaie.");
  }
  return readSession(response);
}

/** Échange un ID token Google natif contre une session mobile. */
export async function loginWithGoogle(
  idToken: string,
): Promise<MobileLoginResponse> {
  const response = await postJson(
    ENDPOINTS.auth.loginWithGoogle,
    { idToken },
    "Connexion Google impossible. Vérifie ta connexion et réessaie.",
  );
  if (!response.ok) {
    throw await readError(response, "Connexion Google impossible. Réessaie.");
  }
  return readSession(response);
}

/**
 * Échange une identité Facebook native contre une session mobile.
 * iOS envoie l'ID token Limited Login + nonce ; Android l'access token Graph.
 */
export async function loginWithFacebook(
  credential: FacebookCredential,
): Promise<MobileLoginResponse> {
  const body =
    "idToken" in credential
      ? { idToken: credential.idToken, nonce: credential.nonce }
      : { accessToken: credential.accessToken };
  const response = await postJson(
    ENDPOINTS.auth.loginWithFacebook,
    body,
    "Connexion Facebook impossible. Vérifie ta connexion et réessaie.",
  );
  if (!response.ok) {
    throw await readError(
      response,
      "Connexion Facebook impossible. Réessaie ou utilise la connexion par email.",
    );
  }
  return readSession(response);
}
