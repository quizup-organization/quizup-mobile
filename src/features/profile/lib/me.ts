import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { isMockData } from "@/lib/config";
import type { Me } from "@/features/profile/domain/me";
import { meService as mockMeService } from "./me.mock";

const apiMeService = {
  get: (): Promise<Me> => api.get<Me>(ENDPOINTS.me),

  completeOnboarding: (): Promise<Me> =>
    api.post<Me>(ENDPOINTS.meOnboarding),
};

/** Profil courant réel (`GET /api/me`) ou base de démonstration locale. */
export const meService = isMockData ? mockMeService : apiMeService;
