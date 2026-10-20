import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Card,
  FieldError,
  Input,
  Label,
  TextField,
  Typography,
} from "heroui-native";
import type { SessionEndReason } from "@/shared/types/session";
import { FacebookIcon } from "@/features/auth/components/facebook-icon";
import { GoogleIcon } from "@/features/auth/components/google-icon";
import { isFacebookSignInAvailable } from "@/features/auth/lib/facebook";
import { isGoogleSignInAvailable } from "@/features/auth/lib/google";
import { useNativeLogin } from "@/features/auth/hooks/useNativeLogin";
import { useSessionStore } from "@/features/auth/session-store";

const emailSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

const codeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Le code doit contenir 6 chiffres"),
});

type EmailValues = z.infer<typeof emailSchema>;
type CodeValues = z.infer<typeof codeSchema>;
type Step = "email" | "code";

const RESEND_COOLDOWN_MS = 60_000;

const END_REASON_MESSAGE: Record<SessionEndReason, string> = {
  expired: "Ta session a expiré. Reconnecte-toi.",
  suspended: "Ton compte est suspendu. Consulte l'email reçu.",
  unknownUser: "Ce compte n'existe plus. Reconnecte-toi avec un autre compte.",
};

function errorMessage(error: unknown): string | null {
  return error instanceof Error ? error.message : null;
}

export default function LoginScreen() {
  const { requestCode, loginWithCode, loginWithGoogle, loginWithFacebook } =
    useNativeLogin();
  const endReason = useSessionStore((state) => state.endReason);
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [resendAvailableAt, setResendAvailableAt] = useState(0);
  const [now, setNow] = useState(Date.now());

  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });
  const codeForm = useForm<CodeValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: "" },
  });

  useEffect(() => {
    if (step !== "code") return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [step]);

  const remainingSeconds = Math.max(
    0,
    Math.ceil((resendAvailableAt - now) / 1000),
  );
  const googleAvailable = isGoogleSignInAvailable();
  const facebookAvailable = isFacebookSignInAvailable();
  const socialAvailable = googleAvailable || facebookAvailable;
  const pending =
    requestCode.isPending ||
    loginWithCode.isPending ||
    loginWithGoogle.isPending ||
    loginWithFacebook.isPending;
  const error =
    errorMessage(loginWithCode.error) ??
    errorMessage(loginWithGoogle.error) ??
    errorMessage(loginWithFacebook.error) ??
    errorMessage(requestCode.error);

  const onSubmitEmail = async (values: EmailValues) => {
    try {
      const normalized = values.email.trim();
      await requestCode.mutateAsync(normalized);
      setEmail(normalized);
      codeForm.reset();
      loginWithCode.reset();
      loginWithGoogle.reset();
      loginWithFacebook.reset();
      setStep("code");
      setResendAvailableAt(Date.now() + RESEND_COOLDOWN_MS);
      setNow(Date.now());
    } catch {
      // L'erreur est portée par la mutation.
    }
  };

  const onResend = async () => {
    if (remainingSeconds > 0) return;
    try {
      await requestCode.mutateAsync(email);
      setResendAvailableAt(Date.now() + RESEND_COOLDOWN_MS);
      setNow(Date.now());
    } catch {
      // L'erreur est portée par la mutation.
    }
  };

  const backToEmail = () => {
    setStep("email");
    setEmail("");
    codeForm.reset();
    loginWithCode.reset();
    loginWithGoogle.reset();
    loginWithFacebook.reset();
    requestCode.reset();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 24,
          gap: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center gap-3">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-accent">
            <Typography type="h2" className="text-accent-foreground">
              Q
            </Typography>
          </View>
          <Typography type="h3">QuizUp</Typography>
          <Typography type="body-sm" color="muted" className="text-center">
            Teste tes connaissances, défie tes amis.
          </Typography>
        </View>

        {endReason ? (
          <Card variant="secondary">
            <Card.Body>
              <Typography type="body-sm" className="text-danger">
                {END_REASON_MESSAGE[endReason]}
              </Typography>
            </Card.Body>
          </Card>
        ) : null}

        <Card>
          <Card.Body className="gap-5">
            <View className="gap-1">
              <Typography type="h4">
                {step === "email" ? "Connexion" : "Vérifie ta boîte mail"}
              </Typography>
              <Typography type="body-sm" color="muted">
                {step === "email"
                  ? "Entre ton email pour recevoir un code de connexion."
                  : `Code envoyé à ${email}. Il expire dans 10 minutes.`}
              </Typography>
            </View>

            {step === "email" ? (
              <>
                <TextField isRequired isInvalid={Boolean(emailForm.formState.errors.email)}>
                  <Label>Email</Label>
                  <Controller
                    control={emailForm.control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="toi@exemple.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="email"
                        textContentType="emailAddress"
                        returnKeyType="send"
                        onSubmitEditing={emailForm.handleSubmit(onSubmitEmail)}
                        editable={!pending}
                      />
                    )}
                  />
                  <FieldError>
                    {emailForm.formState.errors.email?.message}
                  </FieldError>
                </TextField>

                <Button
                  size="lg"
                  isDisabled={pending}
                  onPress={emailForm.handleSubmit(onSubmitEmail)}
                >
                  {requestCode.isPending ? "Envoi…" : "Recevoir un code"}
                </Button>

                {socialAvailable ? (
                  <View className="gap-3">
                    <View className="flex-row items-center gap-3">
                      <View className="h-px flex-1 bg-separator" />
                      <Typography type="body-xs" color="muted">
                        ou
                      </Typography>
                      <View className="h-px flex-1 bg-separator" />
                    </View>

                    {googleAvailable ? (
                      <Button
                        variant="secondary"
                        size="lg"
                        isDisabled={pending}
                        onPress={() => loginWithGoogle.mutate()}
                      >
                        <GoogleIcon size={18} />
                        <Button.Label>
                          {loginWithGoogle.isPending
                            ? "Connexion Google…"
                            : "Continuer avec Google"}
                        </Button.Label>
                      </Button>
                    ) : null}

                    {facebookAvailable ? (
                      <Button
                        variant="secondary"
                        size="lg"
                        isDisabled={pending}
                        onPress={() => loginWithFacebook.mutate()}
                      >
                        <FacebookIcon size={18} />
                        <Button.Label>
                          {loginWithFacebook.isPending
                            ? "Connexion Facebook…"
                            : "Continuer avec Facebook"}
                        </Button.Label>
                      </Button>
                    ) : null}
                  </View>
                ) : null}

                <Typography type="body-xs" color="muted" align="center">
                  Pas encore de compte ? Il sera créé automatiquement.
                </Typography>
              </>
            ) : (
              <>
                <TextField isRequired isInvalid={Boolean(codeForm.formState.errors.code)}>
                  <Label>Code de connexion</Label>
                  <Controller
                    control={codeForm.control}
                    name="code"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        value={value}
                        onChangeText={(text) =>
                          onChange(text.replace(/[^0-9]/g, "").slice(0, 6))
                        }
                        onBlur={onBlur}
                        placeholder="000000"
                        keyboardType="number-pad"
                        maxLength={6}
                        autoComplete="one-time-code"
                        textContentType="oneTimeCode"
                        autoFocus
                        editable={!loginWithCode.isPending}
                        className="text-center text-2xl tracking-[8px]"
                      />
                    )}
                  />
                  <FieldError>{codeForm.formState.errors.code?.message}</FieldError>
                </TextField>

                <Button
                  size="lg"
                  isDisabled={requestCode.isPending || loginWithCode.isPending}
                  onPress={codeForm.handleSubmit((values) =>
                    loginWithCode.mutate({ email, code: values.code }),
                  )}
                >
                  {loginWithCode.isPending ? "Connexion…" : "Se connecter"}
                </Button>

                <View className="items-center gap-3">
                  <Pressable
                    onPress={() => {
                      void onResend();
                    }}
                    disabled={remainingSeconds > 0 || requestCode.isPending}
                  >
                    <Typography
                      type="body-sm"
                      color={remainingSeconds > 0 ? "muted" : "default"}
                      className={remainingSeconds > 0 ? "" : "text-accent"}
                    >
                      {remainingSeconds > 0
                        ? `Renvoyer le code dans ${remainingSeconds} s`
                        : requestCode.isPending
                          ? "Envoi…"
                          : "Renvoyer le code"}
                    </Typography>
                  </Pressable>
                  <Pressable onPress={backToEmail} disabled={loginWithCode.isPending}>
                    <Typography type="body-sm" color="muted" className="underline">
                      Modifier l'adresse
                    </Typography>
                  </Pressable>
                </View>
              </>
            )}

            {error ? (
              <Typography type="body-sm" className="text-danger">
                {error}
              </Typography>
            ) : null}
          </Card.Body>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
