import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { isMockData } from "@/lib/config";
import type { Home } from "../domain/home";
import { homeService as mockHomeService } from "./home.mock";

const apiHomeService = {
  get: (): Promise<Home> => api.get<Home>(ENDPOINTS.home),
};

/** Accueil réel (`GET /api/home`) ou base de démonstration locale. */
export const homeService = isMockData ? mockHomeService : apiHomeService;
