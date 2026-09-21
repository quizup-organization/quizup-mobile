import { useEffect, useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
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

const RESEND_COOLDOWN_SECONDS = 60;

const schema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  code: z.string().regex(/^\d{6}$/, "Le code doit contenir 6 chiffres"),
});

type Values = z.infer<typeof schema>;

export function VerifyCodeScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const setPkce = useSessionStore((s) => s.setPkce);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: email ?? "", code: "" },
  });

  useEffect(() => {
    if (!email) {
      router.replace("/(auth)/login");
    }
  }, [email, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((value) => value - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const onSubmit = async (values: Values) => {
    setError(null);
    setPending(true);
    try {
      await authService.verifyCode(values.email, values.code);
      const { verifier, challenge, state } = await createPkce();
      setPkce(verifier, buildAuthorizeUrl(challenge, state));
      router.push("/auth-webview");
    } catch {
      setError("Code invalide ou expiré. Réessaie.");
    } finally {
      setPending(false);
    }
  };

  const onResend = async () => {
    const target = getValues("email");
    if (!target || cooldown > 0) return;
    try {
      await authService.requestCode(target);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch {
      setError("Impossible de renvoyer le code.");
    }
  };

  return (
    <Screen>
      <View className="mb-6 gap-1">
        <Text className="text-2xl font-extrabold">Vérifie ta boîte mail</Text>
        <Text className="text-sm text-muted-foreground">
          Saisis le code à 6 chiffres envoyé à {email ?? "ton adresse"}.
        </Text>
      </View>

      <Card className="gap-4">
        <View className="gap-2">
          <Text className="text-sm font-medium">Code de connexion</Text>
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <Input
                value={field.value}
                onChangeText={field.onChange}
                keyboardType="number-pad"
                maxLength={6}
                autoCapitalize="none"
                placeholder="123456"
                className="text-center"
              />
            )}
          />
          {errors.code && (
            <Text className="text-xs text-destructive">{errors.code.message}</Text>
          )}
        </View>

        {error && <Text className="text-xs text-destructive">{error}</Text>}

        <Button
          label={pending ? "Vérification…" : "Se connecter"}
          disabled={pending}
          onPress={handleSubmit(onSubmit)}
        />

        <Button
          label={cooldown > 0 ? `Renvoyer le code (${cooldown}s)` : "Renvoyer le code"}
          variant="ghost"
          disabled={cooldown > 0}
          onPress={onResend}
        />
      </Card>
    </Screen>
  );
}
