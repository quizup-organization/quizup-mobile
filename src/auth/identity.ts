import { authConfig } from "./config";
import { AuthError } from "./errors";
import type {
  FacebookCredentials,
  LoginResponse,
  ProblemDetail,
  Session,
} from "./types";

const JSON_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
} as const;

async function readProblem(response: Response): Promise<ProblemDetail | null> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("json")) return null;

  try {
    return (await response.json()) as ProblemDetail;
  } catch {
    return null;
  }
}

async function request(
  path: string,
  init: RequestInit,
  acceptedStatuses: readonly number[],
): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(`${authConfig.identityUrl}${path}`, init);
  } catch {
    throw new AuthError(
      0,
      "network",
      "Impossible de joindre le serveur. Vérifie ta connexion et réessaie.",
    );
  }

  if (!acceptedStatuses.includes(response.status)) {
    const problem = await readProblem(response);
    throw new AuthError(
      response.status,
      problem?.type,
      problem?.detail ??
        problem?.error_description ??
        problem?.error ??
        problem?.title ??
        "La connexion a échoué. Réessaie.",
    );
  }

  return response;
}

function toSession(payload: LoginResponse): Session {
  if (
    !payload.userId ||
    !payload.email ||
    !payload.accessToken ||
    !payload.refreshToken
  ) {
    throw new AuthError(
      0,
      "invalidSession",
      "Le serveur a renvoyé une session incomplète. Réessaie.",
    );
  }

  return {
    userId: payload.userId,
    email: payload.email,
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
    expiresAt:
      Date.now() + Math.max(0, Number(payload.expiresIn ?? 3600)) * 1000,
  };
}

export async function requestLoginCode(email: string): Promise<void> {
  await request(
    "/api/auth/mobile/request-login-code",
    {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ email }),
    },
    [202],
  );
}

export async function loginWithCode(
  email: string,
  code: string,
): Promise<Session> {
  const response = await request(
    "/api/auth/mobile/login-with-code",
    {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ email, code }),
    },
    [200],
  );

  return toSession((await response.json()) as LoginResponse);
}

export async function loginWithGoogle(idToken: string): Promise<Session> {
  const response = await request(
    "/api/auth/mobile/login-with-google",
    {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ idToken }),
    },
    [200],
  );

  return toSession((await response.json()) as LoginResponse);
}

export async function loginWithFacebook(
  credentials: FacebookCredentials,
): Promise<Session> {
  const response = await request(
    "/api/auth/mobile/login-with-facebook",
    {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify(credentials),
    },
    [200],
  );

  return toSession((await response.json()) as LoginResponse);
}

export async function refreshSession(session: Session): Promise<Session> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: authConfig.mobileClientId,
    refresh_token: session.refreshToken,
  });

  const response = await request(
    "/oauth2/token",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    },
    [200],
  );

  const payload = (await response.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  };

  if (!payload.access_token || !payload.refresh_token) {
    throw new AuthError(
      0,
      "invalidRefresh",
      "La session a expiré. Reconnecte-toi.",
    );
  }

  return {
    ...session,
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    expiresAt:
      Date.now() + Math.max(0, Number(payload.expires_in ?? 3600)) * 1000,
  };
}

export async function logout(refreshToken: string): Promise<void> {
  await request(
    "/api/auth/mobile/logout",
    {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ refreshToken }),
    },
    [204, 200, 401],
  );
}
