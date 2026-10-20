import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { profileSettingsService } from "@/lib/services/profile-settings";
import type { MeView } from "@/shared/types/bff";

export interface ProfileFormValues {
  pseudonym: string;
  bio: string;
  country: string;
  language: "fr" | "en";
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      current,
      values,
    }: {
      userId: string;
      current: MeView;
      values: ProfileFormValues;
    }) => {
      const pseudonym = values.pseudonym.trim();
      const bio = values.bio.trim() || null;
      const country = values.country.trim() || null;
      const calls: Promise<void>[] = [];

      if (pseudonym !== current.pseudonym) {
        calls.push(profileSettingsService.updatePseudonym(userId, pseudonym));
      }
      if (bio !== (current.bio ?? null)) {
        calls.push(profileSettingsService.updateBio(userId, bio));
      }
      if (country !== (current.country ?? null)) {
        calls.push(profileSettingsService.updateCountry(userId, country));
      }
      if (values.language !== current.language) {
        calls.push(
          profileSettingsService.updateLanguage(userId, values.language),
        );
      }

      await Promise.all(calls);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.me() });
    },
  });
}
