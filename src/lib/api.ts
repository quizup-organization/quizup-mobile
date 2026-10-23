import { ApiError } from "@/shared/types/api";
import { config } from "@/lib/config";
import { sessionGateway } from "@/lib/session";

interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  /** Ne pas tenter de refresh sur 401 (endpoints publics). */
  skipAuthRefresh?: boolean;
}

const DEFAULT_TIMEOUT_MS = 15_000;

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

/**
 * Client HTTP mobile du BFF : base URL, Bearer token, refresh single-flight sur 401,
 * délai maximal et conversion des `ProblemDetail` en `ApiError`.
 */
export const api = {
  get<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return request<T>("GET", path, options);
  },
  post<T>(
    path: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    return request<T>("POST", path, { ...options, body });
  },
  put<T>(
    path: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    return request<T>("PUT", path, { ...options, body });
  },
  delete<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return request<T>("DELETE", path, options);
  },
};

async function request<T>(
  method: string,
  path: string,
  options: RequestOptions,
): Promise<T> {
  const {
    params,
    body,
    headers: requestHeaders,
    skipAuthRefresh,
    signal: externalSignal,
    ...fetchOptions
  } = options;

  const query = Object.entries(params ?? {})
    .filter((entry): entry is [string, string | number | boolean] =>
      entry[1] !== undefined,
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join("&");
  const url = `${config.apiUrl}${path}${query ? `?${query}` : ""}`;

  const controller = new AbortController();
  let timedOut = false;
  const abortExternal = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener("abort", abortExternal, { once: true });
  }
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, DEFAULT_TIMEOUT_MS);

  const send = (token: string | null) => {
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(requestHeaders as Record<string, string> | undefined),
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    return fetch(url, {
      ...fetchOptions,
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  };

  try {
    const tokenUsed = sessionGateway.getAccessToken();
    let response = await send(tokenUsed);

    if (response.status === 401 && !skipAuthRefresh) {
      // Une autre requête a pu renouveler la session pendant ce 401 : dans ce cas
      // on rejoue avec le jeton courant sans déclencher une seconde rotation.
      const latest = sessionGateway.getAccessToken();
      const refreshed =
        latest && latest !== tokenUsed
          ? latest
          : await sessionGateway.refresh();
      if (refreshed) response = await send(refreshed);
    }

    if (!response.ok) {
      const problem = (await response.json().catch(() => null)) as
        | { status?: number; type?: string; title?: string; detail?: string }
        | null;
      throw new ApiError(
        problem?.detail ?? problem?.title ?? response.statusText,
        {
          statusCode: problem?.status ?? response.status,
          type: problem?.type,
          detail: problem?.detail,
        },
      );
    }

    if (response.status === 204 || response.status === 205) {
      return undefined as T;
    }

    const text = await response.text();
    if (!text) return undefined as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new ApiError("Le serveur a renvoyé une réponse invalide.", {
        statusCode: response.status,
        type: "urn:quizup:api:invalid-response",
      });
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (isAbortError(error) && !externalSignal?.aborted) {
      throw new ApiError(
        timedOut
          ? "Le serveur met trop de temps à répondre."
          : "La requête a été interrompue.",
        { statusCode: timedOut ? 408 : 499 },
      );
    }
    if (error instanceof TypeError) {
      throw new ApiError(
        "Impossible de joindre le serveur. Vérifie ta connexion et réessaie.",
        { statusCode: 0, type: "urn:quizup:network:unreachable" },
      );
    }
    throw error;
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener("abort", abortExternal);
  }
}
