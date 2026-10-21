import * as Linking from "expo-linking";
import { useEffect, useRef, useState } from "react";

import {
  AppButton,
  AppSocialButton,
  AppText,
  AppTextField,
  Column,
  Row,
  Screen,
  Spacer,
  type TextInputRef,
} from "@/components";
import { isFacebookConfigured, isGoogleConfigured } from "@/lib/config";
import {
  AuthCancelledError,
  AuthError,
  codeSchema,
  emailSchema,
  isFacebookEmailMissing,
  useAuth,
} from "@/features/auth";
import { useContentWidth } from "@/hooks/use-content-width";

const RESEND_DELAY_SECONDS = 60;
const FORM_MAX_WIDTH = 420;

type Step = "email" | "code";
type Pending = "request" | "code" | "google" | "facebook" | null;

function messageFor(error: unknown): string {
  if (error instanceof AuthCancelledError) return "";
  if (error instanceof AuthError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return "La connexion a échoué. Réessaie.";
}

export function LoginPage() {
  const contentWidth = useContentWidth();
  const formWidth = Math.min(contentWidth, FORM_MAX_WIDTH);
  const {
    requestLoginCode,
    loginWithCode,
    loginWithGoogle,
    loginWithFacebook,
  } = useAuth();

  const [step, setStep] = useState<Step>("email");
  const [pending, setPending] = useState<Pending>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resendIn, setResendIn] = useState(0);

  const emailRef = useRef<TextInputRef>(null);
  const codeRef = useRef<TextInputRef>(null);

  const isBusy = pending !== null;
  const isEmailValid = emailSchema.safeParse(email).success;
  const isCodeValid = codeSchema.safeParse(code).success;

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => {
      setResendIn((value) => Math.max(0, value - 1));
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  useEffect(() => {
    if (step !== "code") return;
    const timer = setTimeout(() => codeRef.current?.focus(), 150);
    return () => clearTimeout(timer);
  }, [step]);

  async function handleRequestCode() {
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ?? "Entre une adresse email valide.",
      );
      return;
    }
    const normalized = parsed.data;

    setPending("request");
    setError(null);

    try {
      await requestLoginCode(normalized);
      setEmail(normalized);
      setCode("");
      setStep("code");
      setResendIn(RESEND_DELAY_SECONDS);
    } catch (requestError) {
      setError(messageFor(requestError));
    } finally {
      setPending(null);
    }
  }

  async function handleLoginCode() {
    if (!isCodeValid) return;

    setPending("code");
    setError(null);

    try {
      await loginWithCode(email, code);
    } catch (loginError) {
      setError(messageFor(loginError));
      if (loginError instanceof AuthError && loginError.status === 401) {
        setCode("");
        codeRef.current?.clear();
        codeRef.current?.focus();
      }
    } finally {
      setPending(null);
    }
  }

  async function handleResend() {
    if (resendIn > 0 || isBusy) return;

    setPending("request");
    setError(null);

    try {
      await requestLoginCode(email);
      setResendIn(RESEND_DELAY_SECONDS);
    } catch (resendError) {
      setError(messageFor(resendError));
    } finally {
      setPending(null);
    }
  }

  function handleChangeEmail() {
    if (isBusy) return;
    setStep("email");
    setCode("");
    setError(null);
    setTimeout(() => emailRef.current?.focus(), 150);
  }

  async function handleGoogle() {
    if (!isGoogleConfigured) {
      setError("Google n'est pas configuré dans ce build.");
      return;
    }

    setPending("google");
    setError(null);

    try {
      await loginWithGoogle();
    } catch (googleError) {
      const message = messageFor(googleError);
      if (message) setError(message);
    } finally {
      setPending(null);
    }
  }

  async function handleFacebook() {
    if (!isFacebookConfigured) {
      setError("Facebook n'est pas configuré dans ce build.");
      return;
    }

    setPending("facebook");
    setError(null);

    try {
      await loginWithFacebook();
    } catch (facebookError) {
      if (isFacebookEmailMissing(facebookError)) {
        setStep("email");
        setCode("");
        setError(
          "Facebook n'a pas transmis d'email. Utilise la connexion par email.",
        );
        setTimeout(() => emailRef.current?.focus(), 150);
      } else {
        const message = messageFor(facebookError);
        if (message) setError(message);
      }
    } finally {
      setPending(null);
    }
  }

  const isRequestingCode = pending === "request";
  const isSubmittingCode = pending === "code";
  const googleLabel =
    pending === "google" ? "Connexion..." : "Continuer avec Google";
  const facebookLabel =
    pending === "facebook" ? "Connexion..." : "Continuer avec Facebook";

  return (
    <Screen topInset align="center">
      <Column spacing={6} alignment="center" style={{ width: formWidth }}>
        <AppText variant="display">QuizUp</AppText>
        <AppText variant="body" tone="muted" align="center" width={formWidth}>
          Connecte-toi pour jouer
        </AppText>
      </Column>

      <Column spacing={12} style={{ width: formWidth }}>
        {step === "email" ? (
          <>
            <AppTextField
              ref={emailRef}
              defaultValue={email}
              placeholder="ton@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              returnKeyType="send"
              onSubmitEditing={handleRequestCode}
              onChangeText={setEmail}
              editable={!isBusy}
              style={{ width: formWidth }}
            />
            <AppButton
              label={isRequestingCode ? "Envoi..." : "Recevoir un code"}
              onPress={handleRequestCode}
              disabled={!isEmailValid || isBusy}
              style={{ width: formWidth }}
            />
          </>
        ) : (
          <>
            <AppText
              variant="caption"
              tone="muted"
              align="center"
              width={formWidth}
            >
              {`Code envoyé à ${email}`}
            </AppText>
            <AppTextField
              ref={codeRef}
              defaultValue=""
              placeholder="000000"
              keyboardType="number-pad"
              autoComplete="one-time-code"
              textAlign="center"
              maxLength={6}
              autoFocus
              onChangeText={(value) =>
                setCode(value.replace(/\D/g, "").slice(0, 6))
              }
              editable={!isBusy}
              style={{ width: formWidth }}
              textStyle={{
                fontSize: 28,
                fontWeight: "700",
                letterSpacing: 6,
              }}
            />
            <AppButton
              label={isSubmittingCode ? "Connexion..." : "Se connecter"}
              onPress={handleLoginCode}
              disabled={!isCodeValid || isBusy}
              style={{ width: formWidth }}
            />
            <Row spacing={8} alignment="center" style={{ width: formWidth }}>
              <AppButton
                variant="text"
                label={
                  isRequestingCode
                    ? "Envoi..."
                    : resendIn > 0
                      ? `Renvoyer (${resendIn} s)`
                      : "Renvoyer le code"
                }
                onPress={handleResend}
                disabled={resendIn > 0 || isBusy}
              />
              <Spacer flexible />
              <AppButton
                variant="text"
                label="Changer d'email"
                onPress={handleChangeEmail}
                disabled={isBusy}
              />
            </Row>
          </>
        )}
      </Column>

      <Column spacing={12} style={{ width: formWidth }}>
        <AppText
          variant="caption"
          tone="muted"
          align="center"
          width={formWidth}
        >
          ou continuer avec
        </AppText>
        <AppSocialButton
          badge="G"
          badgeColor="#4285F4"
          label={googleLabel}
          onPress={handleGoogle}
          disabled={isBusy || !isGoogleConfigured}
          style={{ width: formWidth }}
        />
        <AppSocialButton
          badge="f"
          badgeColor="#1877F2"
          label={facebookLabel}
          onPress={handleFacebook}
          disabled={isBusy || !isFacebookConfigured}
          style={{ width: formWidth }}
        />
        {__DEV__ && (!isGoogleConfigured || !isFacebookConfigured) ? (
          <AppText
            variant="caption"
            tone="muted"
            align="center"
            width={formWidth}
          >
            Google/Facebook non configurés dans ce build.
          </AppText>
        ) : null}
      </Column>

      {error ? (
        <AppText variant="caption" tone="danger" align="center" width={formWidth}>
          {error}
        </AppText>
      ) : null}

      <Row spacing={18} alignment="center" style={{ width: formWidth }}>
        <Spacer flexible />
        <AppText
          variant="caption"
          tone="muted"
          onPress={() => {
            void Linking.openURL("https://app.quizup.cnadjim.fr/privacy.html");
          }}
        >
          Confidentialité
        </AppText>
        <AppText
          variant="caption"
          tone="muted"
          onPress={() => {
            void Linking.openURL("https://app.quizup.cnadjim.fr/terms.html");
          }}
        >
          Conditions
        </AppText>
        <Spacer flexible />
      </Row>
    </Screen>
  );
}
