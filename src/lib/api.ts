import { createApiClient } from "./api-client";
import { config } from "./config";
import { clearSession, getAccessToken, refreshAccessToken } from "./auth";

export const api = createApiClient({
  baseUrl: config.apiUrl,
  getAuthToken: () => getAccessToken(),
  onError: (error) =>
    console.error(`[API] ${error.statusCode ?? "?"}: ${error.message}`),
  onUnauthorized: async () => {
    try {
      await refreshAccessToken();
      return true;
    } catch {
      await clearSession();
      return false;
    }
  },
});
