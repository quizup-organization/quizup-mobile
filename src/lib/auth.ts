import { config } from "./config";
import { deleteItem, getItem, setItem } from "./storage";

const ACCESS_TOKEN_KEY = "quizup.accessToken";
const REFRESH_TOKEN_KEY = "quizup.refreshToken";
const USER_ID_KEY = "quizup.userId";

let accessToken: string | null = null;
let userId: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function getUserId(): string | null {
  return userId;
}

export function decodeUserId(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    const json = JSON.parse(atob(padded)) as {
      user_id?: string;
      sub?: string;
    };
    return json.user_id ?? json.sub ?? null;
  } catch {
    return null;
  }
}

async function persist(access: string, refresh?: string) {
  accessToken = access;
  userId = decodeUserId(access);
  await setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) await setItem(REFRESH_TOKEN_KEY, refresh);
  if (userId) await setItem(USER_ID_KEY, userId);
}

export async function restoreSession(): Promise<boolean> {
  accessToken = await getItem(ACCESS_TOKEN_KEY);
  userId = (await getItem(USER_ID_KEY)) ?? (accessToken ? decodeUserId(accessToken) : null);
  return !!accessToken;
}

export async function clearSession(): Promise<void> {
  accessToken = null;
  userId = null;
  await deleteItem(ACCESS_TOKEN_KEY);
  await deleteItem(REFRESH_TOKEN_KEY);
  await deleteItem(USER_ID_KEY);
}

export const REDIRECT_URI = "quizup://callback";

/**
 * URL d'autorisation OIDC (Authorization Code + PKCE) pour la WebView d'authentification.
 * La session `AUTH_TX` étant créée par `POST /api/auth/verify-code` dans le cookie jar partagé
 * avec la WebView, `/oauth2/authorize` émet directement le code.
 */
export function buildAuthorizeUrl(challenge: string, state: string): string {
  const params = new URLSearchParams({
    client_id: config.oidcClientId,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "openid profile email",
    code_challenge: challenge,
    code_challenge_method: "S256",
    state,
  });
  return `${config.oidcAuthority}/oauth2/authorize?${params.toString()}`;
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
}

/** Échange le code d'autorisation contre des tokens (PKCE, client public). */
export async function exchangeAuthorizationCode(
  code: string,
  verifier: string,
): Promise<void> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: config.oidcClientId,
    code_verifier: verifier,
  });

  const response = await fetch(`${config.oidcAuthority}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`Échange du code impossible (${response.status})`);
  }

  const tokens = (await response.json()) as TokenResponse;
  await persist(tokens.access_token, tokens.refresh_token);
}
