import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";

/**
 * Écritures BFF du profil courant. Un endpoint par champ, comme le web ;
 * `null` efface la bio / le pays.
 */
export const profileSettingsService = {
  updatePseudonym: (userId: string, pseudonym: string): Promise<void> =>
    api.put<void>(ENDPOINTS.profileSettings.pseudonym(userId), { pseudonym }),

  updateBio: (userId: string, bio: string | null): Promise<void> =>
    api.put<void>(ENDPOINTS.profileSettings.bio(userId), { bio }),

  updateCountry: (userId: string, country: string | null): Promise<void> =>
    api.put<void>(ENDPOINTS.profileSettings.country(userId), { country }),

  updateLanguage: (
    userId: string,
    language: "fr" | "en",
  ): Promise<void> =>
    api.put<void>(ENDPOINTS.profileSettings.language(userId), { language }),
};
