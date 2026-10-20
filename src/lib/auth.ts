import { config } from "./config";
import { ENDPOINTS } from "./endpoints";
import { deleteItem, getItem, setItem } from "./storage";
import type { SessionEndReason } from "@/shared/types/session";

const ACCESS_TOKEN_KEY = "quizup.accessToken";
const REFRESH_TOKEN_KEY = "quizup.refreshToken";
const USER_ID_KEY = "quizup.userId";
const EXPIRES_AT_KEY = "quizup.expiresAt";

let accessToken: string | null = null;
let refreshToken: string | null = null;
let userId: string | null = null;
let refreshPromise: Promise<void> | null = null;
let restorePromise: Promise<SessionRestoreResult> | null = null;

type SessionEndedListener = (reason: SessionEndReason) => void;
const sessionEndedListeners = new Set<SessionEndedListener>();

export interface SessionRestoreResult {
  authenticated: boolean;
  reason?: SessionEndReason;
}

/**
 * Échec de renouvellement. `definitive` distingue un refus métier (`invalid_grant`, 4xx)
 * d'un incident réseau/5xx : un incident transitoire ne doit jamais purger la session.
 */
export class SessionRefreshError extends Error {
  readonly definitive: boolean;
  readonly reason?: SessionEndReason;

  constructor(
    message: string,
    definitive: boolean,
    reason?: SessionEndReason,
  ) {
    super(message);
    this.name = "SessionRefreshError";
    this.definitive = definitive;
    this.reason = reason;
  }
}

/** Abonnement aux fins de session déclenchées par les appels API (401/403). */
export function onSessionEnded(listener: SessionEndedListener): () => void {
  sessionEndedListeners.add(listener);
  return () => {
    sessionEndedListeners.delete(listener);
  };
}

function emitSessionEnded(reason: SessionEndReason): void {
  for (const listener of [...sessionEndedListeners]) {
    listener(reason);
  }
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function getRefreshToken(): string | null {
  return refreshToken;
}

export function getUserId(): string | null {
  return userId;
}

const BASE64_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

/**
 * Décode une chaîne base64url sans dépendre de `atob` (absent de Hermes).
 * Suffisant pour lire les claims ASCII d'un JWT (`user_id`, `sub`).
 */
function decodeBase64Url(input: string): string {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );

  let bits = 0;
  let value = 0;
  let output = "";
  for (const char of padded) {
    if (char === "=") break;
    const index = BASE64_ALPHABET.indexOf(char);
    if (index < 0) continue;
    value = (value << 6) | index;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      output += String.fromCharCode((value >> bits) & 0xff);
    }
  }
  return output;
}

export function decodeUserId(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(decodeBase64Url(payload)) as {
      user_id?: string;
      sub?: string;
    };
    return json.user_id ?? json.sub ?? null;
  } catch {
    return null;
  }
}

export interface SessionTokens {
  accessToken: string;
  refreshToken?: string | null;
  expiresIn?: number | null;
  issuedAt?: number | null;
  userId?: string | null;
}

/**
 * Persiste les tokens de session (SecureStore natif / localStorage web).
 *
 * <p>Le mobile reçoit aussi `userId` dans la réponse d'auth ; on garde le décodage du JWT
 * en repli pour le refresh (qui ne renvoie que les tokens OAuth standard).</p>
 */
export async function persistSession(tokens: SessionTokens): Promise<void> {
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken ?? null;
  userId = tokens.userId ?? decodeUserId(accessToken) ?? userId;

  const issuedAt = tokens.issuedAt ?? Math.floor(Date.now() / 1000);
  const expiresAt = tokens.expiresIn ? issuedAt + tokens.expiresIn : null;

  await setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    await setItem(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    await deleteItem(REFRESH_TOKEN_KEY);
  }
  if (userId) {
    await setItem(USER_ID_KEY, userId);
  } else {
    await deleteItem(USER_ID_KEY);
  }
  if (expiresAt) {
    await setItem(EXPIRES_AT_KEY, String(expiresAt));
  } else {
    await deleteItem(EXPIRES_AT_KEY);
  }
}

interface StandardTokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
}

interface StandardTokenProblem {
  error?: string;
  error_description?: string;
}

function isDefinitiveRefreshStatus(status: number): boolean {
  return status === 400 || status === 401 || status === 403;
}

async function performRefresh(): Promise<void> {
  const startedWith = refreshToken;
  if (!startedWith) {
    throw new SessionRefreshError(
      "Aucun refresh token disponible",
      true,
      "expired",
    );
  }

  const body = [
    "grant_type=refresh_token",
    `client_id=${encodeURIComponent(config.clientId)}`,
    `refresh_token=${encodeURIComponent(startedWith)}`,
  ].join("&");

  let response: Response;
  try {
    response = await fetch(ENDPOINTS.auth.token, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
  } catch {
    throw new SessionRefreshError(
      "Réseau indisponible pendant le renouvellement de session",
      false,
    );
  }

  if (!response.ok) {
    const problem = (await response
      .json()
      .catch(() => null)) as StandardTokenProblem | null;
    const description =
      problem?.error_description ??
      problem?.error ??
      "Renouvellement de session impossible";
    const definitive = isDefinitiveRefreshStatus(response.status);
    const suspended = /account_suspended/i.test(
      `${problem?.error ?? ""} ${problem?.error_description ?? ""}`,
    );

    throw new SessionRefreshError(
      description,
      definitive,
      definitive ? (suspended ? "suspended" : "expired") : undefined,
    );
  }

  let tokens: StandardTokenResponse;
  try {
    tokens = (await response.json()) as StandardTokenResponse;
  } catch {
    throw new SessionRefreshError(
      "Réponse de renouvellement invalide",
      false,
    );
  }

  if (!tokens.access_token) {
    throw new SessionRefreshError(
      "Réponse d'authentification incomplète",
      false,
    );
  }

  // Garde anti-course : un logout (ou une autre fin de session) survenu pendant le
  // renouvellement ne doit jamais réécrire les tokens.
  if (!refreshToken || refreshToken !== startedWith) {
    throw new SessionRefreshError(
      "Session terminée pendant le renouvellement",
      true,
      "expired",
    );
  }

  await persistSession({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresIn: tokens.expires_in,
    issuedAt: Math.floor(Date.now() / 1000),
  });
}

/**
 * Renouvelle l'access token (single-flight : les 401 concurrents partagent le même refresh).
 *
 * <p>Utilise le endpoint OIDC standard `/oauth2/token` : le mobile est un client public
 * `mobile`, le refresh token est rotaté côté identity.</p>
 */
export function refreshAccessToken(): Promise<void> {
  refreshPromise ??= performRefresh().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

async function doRestoreSession(): Promise<SessionRestoreResult> {
  accessToken = await getItem(ACCESS_TOKEN_KEY);
  refreshToken = await getItem(REFRESH_TOKEN_KEY);
  userId =
    (await getItem(USER_ID_KEY)) ??
    (accessToken ? decodeUserId(accessToken) : null);

  if (!accessToken) {
    if (refreshToken || userId) {
      await clearSession();
    }
    return { authenticated: false };
  }

  const expiresAt = Number((await getItem(EXPIRES_AT_KEY)) ?? 0);
  if (expiresAt > 0 && expiresAt * 1000 <= Date.now()) {
    if (!refreshToken) {
      await clearSession();
      return { authenticated: false, reason: "expired" };
    }
    try {
      await refreshAccessToken();
    } catch (error) {
      if (error instanceof SessionRefreshError && !error.definitive) {
        // Incident réseau/5xx : on conserve les tokens et on laisse le prochain appel
        // API retenter le refresh plutôt que de déconnecter le joueur.
        return { authenticated: true };
      }
      const reason =
        error instanceof SessionRefreshError
          ? (error.reason ?? "expired")
          : "expired";
      await clearSession();
      return { authenticated: false, reason };
    }
  }

  return { authenticated: true };
}

/**
 * Restaure la session au démarrage (single-flight pour les doubles montages React).
 * Un échec transitoire conserve la session ; un échec définitif la purge et expose la raison.
 */
export function restoreSession(): Promise<SessionRestoreResult> {
  restorePromise ??= doRestoreSession().finally(() => {
    restorePromise = null;
  });
  return restorePromise;
}

/**
 * Purge la session locale. Avec une `reason`, émet un événement pour que l'UI termine
 * la session (compte suspendu, session expirée, compte inconnu).
 */
export async function clearSession(reason?: SessionEndReason): Promise<void> {
  const hadSession = Boolean(accessToken || refreshToken || userId);

  accessToken = null;
  refreshToken = null;
  userId = null;
  await deleteItem(ACCESS_TOKEN_KEY);
  await deleteItem(REFRESH_TOKEN_KEY);
  await deleteItem(USER_ID_KEY);
  await deleteItem(EXPIRES_AT_KEY);

  if (reason && hadSession) {
    emitSessionEnded(reason);
  }
}

/**
 * Déconnexion : révoque l'autorisation identity (refresh token) puis purge la session
 * locale. Le endpoint est propre au mobile : pas de cookie, pas de session serveur.
 */
export async function logout(): Promise<void> {
  const token = refreshToken;
  try {
    if (token) {
      await fetch(ENDPOINTS.auth.logout, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: token }),
      });
    }
  } catch {
    // La session locale est purgée dans tous les cas.
  } finally {
    await clearSession();
  }
}
