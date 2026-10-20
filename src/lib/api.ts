import { createApiClient } from "./api-client";
import { config } from "./config";
import {
  clearSession,
  getAccessToken,
  refreshAccessToken,
  SessionRefreshError,
} from "./auth";

const ACCOUNT_SUSPENDED_TYPE = "urn:quizup:authorization:accountSuspended";
const UNKNOWN_USER_TYPE = "urn:quizup:authentification:unknownUser";

export const api = createApiClient({
  baseUrl: config.apiUrl,
  getAuthToken: () => getAccessToken(),
  onError: (error) => {
    if (error.statusCode === 403 && error.type === ACCOUNT_SUSPENDED_TYPE) {
      void clearSession("suspended");
      return;
    }
    if (error.statusCode === 401 && error.type === UNKNOWN_USER_TYPE) {
      void clearSession("unknownUser");
      return;
    }
    console.error(`[API] ${error.statusCode ?? "?"}: ${error.message}`);
  },
  onUnauthorized: async () => {
    try {
      await refreshAccessToken();
      return true;
    } catch (error) {
      if (error instanceof SessionRefreshError && !error.definitive) {
        // Incident réseau/5xx : on ne purge pas la session, le prochain appel réessaiera.
        return false;
      }
      const reason =
        error instanceof SessionRefreshError
          ? (error.reason ?? "expired")
          : "expired";
      await clearSession(reason);
      return false;
    }
  },
});
