import { isMockData, mockScenario } from "@/lib/config";
import { ApiError } from "@/shared/types/api";

/** Latence simulée pour rendre visibles les états de chargement. */
export function mockDelay(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Scénario global `EXPO_PUBLIC_MOCK_SCENARIO`. */
export function assertSuccess(): void {
  if (!isMockData) {
    throw new ApiError("Le client BFF n'est pas encore branché.", {
      statusCode: 501,
      type: "urn:quizup:mock:api-not-wired",
    });
  }
  if (mockScenario === "error") {
    throw new ApiError("Le service est momentanément indisponible.", {
      statusCode: 503,
      type: "urn:quizup:mock:unavailable",
    });
  }
}

export function isEmpty(): boolean {
  return mockScenario === "empty";
}
