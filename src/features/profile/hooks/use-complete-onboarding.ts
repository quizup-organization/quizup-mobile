import { useMutation, useQueryClient } from "@tanstack/react-query";

import { meService } from "@/features/profile/lib/me";
import { queryKeys } from "@/lib/query-keys";

/** Termine l'onboarding et met immédiatement à jour la coquille `me`. */
export function useCompleteOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => meService.completeOnboarding(),
    onSuccess: (me) => {
      queryClient.setQueryData(queryKeys.me(), me);
      void queryClient.invalidateQueries({ queryKey: queryKeys.home() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.topics.all });
    },
  });
}
