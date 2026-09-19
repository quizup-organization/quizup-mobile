import { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Screen } from "@/components/screen";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useThemeStore, type Theme } from "@/lib/theme";
import { clearSession } from "@/lib/auth";
import { profilesService } from "@/lib/services/profiles";
import { queryKeys } from "@/lib/query-keys";
import { useSessionStore } from "@/features/auth/session-store";
import { useCurrentPlayer } from "./use-current-player";

const OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Clair" },
  { value: "dark", label: "Sombre" },
  { value: "system", label: "Système" },
];

const profileSchema = z.object({
  displayName: z.string().min(1, "Nom requis").max(50, "50 caractères max"),
  bio: z.string().max(280, "280 caractères max"),
  country: z.string().max(56, "56 caractères max"),
});

type ProfileValues = z.infer<typeof profileSchema>;

export function SettingsScreen() {
  const router = useRouter();
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const setSession = useSessionStore((s) => s.setSession);
  const { userId, profile } = useCurrentPlayer();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { displayName: "", bio: "", country: "" },
  });

  useEffect(() => {
    if (profile) {
      reset({
        displayName: profile.displayName ?? "",
        bio: profile.bio ?? "",
        country: profile.country ?? "",
      });
    }
  }, [profile, reset]);

  const update = useMutation({
    mutationFn: (values: ProfileValues) =>
      profilesService.update(userId as string, {
        displayName: values.displayName,
        bio: values.bio || undefined,
        country: values.country || undefined,
      }),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.profiles.detail(userId),
        });
      }
    },
  });

  return (
    <Screen>
      <View className="mb-5 flex-row items-center justify-between">
        <Text className="text-2xl font-extrabold">Réglages</Text>
        <Button variant="ghost" size="sm" label="Retour" onPress={() => router.back()} />
      </View>

      <Text className="mb-2 text-sm font-semibold">Profil</Text>
      <Card className="gap-4">
        {(
          [
            { name: "displayName", label: "Nom d'affichage", placeholder: "" },
            { name: "bio", label: "Bio", placeholder: "" },
            { name: "country", label: "Pays", placeholder: "FR" },
          ] as const
        ).map((field) => (
          <View key={field.name} className="gap-2">
            <Text className="text-sm font-medium">{field.label}</Text>
            <Controller
              control={control}
              name={field.name}
              render={({ field: f }) => (
                <Input
                  value={f.value}
                  onChangeText={f.onChange}
                  placeholder={field.placeholder}
                />
              )}
            />
            {errors[field.name] && (
              <Text className="text-xs text-destructive">
                {errors[field.name]?.message}
              </Text>
            )}
          </View>
        ))}
        {update.isSuccess && (
          <Text className="text-xs text-emerald-500">Profil enregistré.</Text>
        )}
        <Button
          label={isSubmitting || update.isPending ? "Enregistrement…" : "Enregistrer"}
          disabled={isSubmitting || update.isPending}
          onPress={handleSubmit((values) => update.mutateAsync(values))}
        />
      </Card>

      <Text className="mt-6 mb-2 text-sm font-semibold">Apparence</Text>
      <Card className="flex-row gap-2">
        {OPTIONS.map((option) => (
          <Button
            key={option.value}
            className="flex-1"
            variant={theme === option.value ? "default" : "outline"}
            label={option.label}
            onPress={() => setTheme(option.value)}
          />
        ))}
      </Card>

      <Button
        className="mt-8"
        variant="outline"
        label="Se déconnecter"
        onPress={async () => {
          await clearSession();
          setSession(false);
          router.replace("/(auth)/login");
        }}
      />
    </Screen>
  );
}
