import { createApiClient } from "./api-client";
import { config } from "./config";
import { getAccessToken } from "./auth";

export const api = createApiClient({
  baseUrl: config.apiUrl,
  getAuthToken: () => getAccessToken(),
  onError: (error) =>
    console.error(`[API] ${error.statusCode ?? "?"}: ${error.message}`),
});
