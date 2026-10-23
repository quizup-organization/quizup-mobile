import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Language } from "@/features/player/domain/profile";
import { profilesService } from "@/features/player/lib/profiles";
import { queryKeys } from "@/lib/query-keys";

export interface ProfilePatch {
  pseudonym?: string;
  bio?: string | null;
  country?: string | null;
  language?: Language;
  avatarOptions?: string | null;
  bannerUrl?: string | null;
}

/** Applique un patch de profil via les endpoints dédiés puis rafraîchit les vues. */
export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (patch: ProfilePatch) => {
      if (patch.pseudonym !== undefined) {
        await profilesService.updatePseudonym(userId, patch.pseudonym);
      }
      if (patch.bio !== undefined) {
        await profilesService.updateBio(userId, patch.bio);
      }
      if (patch.country !== undefined) {
        await profilesService.updateCountry(userId, patch.country);
      }
      if (patch.language !== undefined) {
        await profilesService.updateLanguage(userId, patch.language);
      }
      if (patch.avatarOptions !== undefined) {
        await profilesService.updateAvatarOptions(
          userId,
          patch.avatarOptions,
        );
      }
      if (patch.bannerUrl !== undefined) {
        await profilesService.updateBanner(userId, patch.bannerUrl);
      }
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.me() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all }),
      ]),
  });
}
