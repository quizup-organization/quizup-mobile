import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Screen } from "@/components/screen";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { authService } from "@/lib/services/auth";

const schema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
});

type Values = z.infer<typeof schema>;

export function LoginScreen() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: Values) => {
    setError(null);
    setPending(true);
    try {
      await authService.requestCode(values.email);
      router.push({ pathname: "/(auth)/verify-code", params: { email: values.email } });
    } catch {
      setError("Impossible d'envoyer le code. Réessaie.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Screen>
      <View className="mb-6 gap-1">
        <Text className="text-2xl font-extrabold">Connexion</Text>
        <Text className="text-sm text-muted-foreground">
          Entre ton e-mail : on t'envoie un code de connexion.
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

        {error && <Text className="text-xs text-destructive">{error}</Text>}

        <Button
          label={pending ? "Envoi…" : "Recevoir un code"}
          disabled={pending}
          onPress={handleSubmit(onSubmit)}
        />
      </Card>
    </Screen>
  );
}
