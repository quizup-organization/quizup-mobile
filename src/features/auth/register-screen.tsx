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

const schema = z
  .object({
    email: z.string().email("Adresse e-mail invalide"),
    password: z.string().min(8, "8 caractères minimum").max(128),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirm"],
  });

type Values = z.infer<typeof schema>;

export function RegisterScreen() {
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
    defaultValues: { email: "", password: "", confirm: "" },
  });

  const onSubmit = async (values: Values) => {
    setError(null);
    setPending(true);
    try {
      await authService.register(values.email, values.password);
      const { verifier, challenge, state } = await createPkce();
      setPkce(verifier, buildAuthorizeUrl(challenge, state));
      router.push("/auth-webview");
    } catch {
      setError("Inscription impossible (e-mail déjà utilisé ?).");
    } finally {
      setPending(false);
    }
  };

  return (
    <Screen>
      <View className="mb-6 gap-1">
        <Text className="text-2xl font-extrabold">Inscription</Text>
        <Text className="text-sm text-muted-foreground">
          Un e-mail et un mot de passe suffisent.
        </Text>
      </View>

      <Card className="gap-4">
        {(
          [
            { name: "email", label: "Adresse e-mail", secure: false },
            { name: "password", label: "Mot de passe", secure: true },
            { name: "confirm", label: "Confirme le mot de passe", secure: true },
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
                  secureTextEntry={field.secure}
                  autoCapitalize="none"
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

        {error && <Text className="text-xs text-destructive">{error}</Text>}

        <Button
          label={pending ? "Création…" : "Créer mon compte"}
          disabled={pending}
          onPress={handleSubmit(onSubmit)}
        />
      </Card>

      <View className="mt-4 flex-row justify-center gap-1">
        <Text className="text-sm text-muted-foreground">Déjà inscrit ?</Text>
        <Link href="/(auth)/login">
          <Text className="text-sm font-semibold underline">Se connecter</Text>
        </Link>
      </View>
    </Screen>
  );
}
