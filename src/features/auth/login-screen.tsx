import { useState } from "react";
import { View } from "react-native";
import { Link, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Screen } from "@/components/screen";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { authService } from "@/lib/services/auth";
import { buildAuthorizeUrl } from "@/lib/auth";
import { createPkce } from "@/lib/pkce";
import { useSessionStore } from "./session-store";

const schema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

type Values = z.infer<typeof schema>;

export function LoginScreen() {
  const router = useRouter();
  const setPkce = useSessionStore((s) => s.setPkce);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: Values) => {
    setError(null);
    setPending(true);
    try {
      await authService.login(values.email, values.password);
      const { verifier, challenge, state } = await createPkce();
      setPkce(verifier, buildAuthorizeUrl(challenge, state));
      router.push("/auth-webview");
    } catch {
      setError("Identifiants invalides. Réessaie.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Screen>
      <View className="mb-6 gap-1">
        <Text className="text-2xl font-extrabold">Connexion</Text>
        <Text className="text-sm text-muted-foreground">
          Accède à ton compte QuizUp.
        </Text>
      </View>

      <Card className="gap-4">
        <View className="gap-2">
          <Text className="text-sm font-medium">Adresse e-mail</Text>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                value={field.value}
                onChangeText={field.onChange}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="joueur@quizup.app"
              />
            )}
          />
          {errors.email && (
            <Text className="text-xs text-destructive">{errors.email.message}</Text>
          )}
        </View>

        <View className="gap-2">
          <Text className="text-sm font-medium">Mot de passe</Text>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Input
                value={field.value}
                onChangeText={field.onChange}
                secureTextEntry
                placeholder="••••••••"
              />
            )}
          />
          {errors.password && (
            <Text className="text-xs text-destructive">
              {errors.password.message}
            </Text>
          )}
        </View>

        {error && <Text className="text-xs text-destructive">{error}</Text>}

        <Button
          label={pending ? "Connexion…" : "Se connecter"}
          disabled={pending}
          onPress={handleSubmit(onSubmit)}
        />
      </Card>

      <View className="mt-4 flex-row justify-center gap-1">
        <Text className="text-sm text-muted-foreground">Pas encore de compte ?</Text>
        <Link href="/(auth)/register">
          <Text className="text-sm font-semibold underline">Créer un compte</Text>
        </Link>
      </View>
    </Screen>
  );
}
