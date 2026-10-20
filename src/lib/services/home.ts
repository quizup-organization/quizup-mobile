import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type { HomeView } from "@/shared/types/bff";

/** Accueil composé par le BFF (`GET /api/home`). */
export const homeService = {
  get: (): Promise<HomeView> => api.get<HomeView>(ENDPOINTS.home),
};
