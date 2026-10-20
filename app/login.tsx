import { Column, Row, Spacer, Text } from "@expo/ui";
import type { TextInputRef } from "@expo/ui";
import * as Linking from "expo-linking";
import { useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";

import { isFacebookConfigured, isGoogleConfigured } from "@/auth/config";
import {
  AuthCancelledError,
  AuthError,
  isFacebookEmailMissing,
} from "@/auth/errors";
import { useAuth } from "@/auth/AuthProvider";
import {
  AppButton,
  AppSocialButton,
  AppText,
  AppTextField,
  Block,
  Screen,
} from "@/ui/primitives";
import { useColors } from "@/ui/theme";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_DELAY_SECONDS = 60;

type Step = "email" | "code";
type Pending = "request" | "code" | "google" | "facebook" | null;

function messageFor(error: unknown): string {
  if (error instanceof AuthCancelledError) return "";
  if (error instanceof AuthError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return "La connexion a échoué. Réessaie.";
}

export default function LoginScreen() {
  const c = useColors();
  const { width } = useWindowDimensions();
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

  const formWidth = Math.min(width - 40, 420);
  const horizontalPadding = Math.max(20, (width - formWidth) / 2);
  const isBusy = pending !== null;
  const isEmailValid = EMAIL_PATTERN.test(email.trim());
  const isCodeValid = code.length === 6;

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
    const normalized = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(normalized)) {
      setError("Entre une adresse email valide.");
      return;
    }

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
    <Screen horizontalPadding={horizontalPadding} bottomPadding={24}>
      <Block width={formWidth}>
        <Column spacing={6} alignment="center">
          <AppText variant="display">QuizUp</AppText>
          <AppText variant="body" tone="muted" align="center">
            Connecte-toi pour jouer
          </AppText>
        </Column>
      </Block>

      <Block width={formWidth}>
        <Column spacing={12}>
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
                style={{ width: formWidth, height: 50 }}
              />
            </>
          ) : (
            <>
              <AppText variant="caption" tone="muted" align="center">
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
                style={{ width: formWidth, height: 60 }}
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
                style={{ width: formWidth, height: 50 }}
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
      </Block>

      <Block width={formWidth}>
        <Column spacing={12}>
          <AppText variant="caption" tone="muted" align="center">
            ou continuer avec
          </AppText>
          <AppSocialButton
            badge="G"
            badgeColor="#4285F4"
            label={googleLabel}
            onPress={handleGoogle}
            disabled={isBusy || !isGoogleConfigured}
            style={{ width: formWidth, height: 50 }}
          />
          <AppSocialButton
            badge="f"
            badgeColor="#1877F2"
            label={facebookLabel}
            onPress={handleFacebook}
            disabled={isBusy || !isFacebookConfigured}
            style={{ width: formWidth, height: 50 }}
          />
          {__DEV__ && (!isGoogleConfigured || !isFacebookConfigured) ? (
            <AppText variant="caption" tone="muted" align="center">
              Google/Facebook non configurés dans ce build.
            </AppText>
          ) : null}
        </Column>
      </Block>

      {error ? (
        <Block width={formWidth}>
          <Text
            textStyle={{
              fontSize: 13,
              color: c.danger,
              textAlign: "center",
            }}
          >
            {error}
          </Text>
        </Block>
      ) : null}

      <Block width={formWidth}>
        <Column spacing={8} alignment="center">
          <Row spacing={18} alignment="center">
            <Text
              onPress={() => {
                void Linking.openURL(
                  "https://app.quizup.cnadjim.fr/privacy.html",
                );
              }}
              textStyle={{ fontSize: 13, color: c.textMuted }}
            >
              Confidentialité
            </Text>
            <Text
              onPress={() => {
                void Linking.openURL(
                  "https://app.quizup.cnadjim.fr/terms.html",
                );
              }}
              textStyle={{ fontSize: 13, color: c.textMuted }}
            >
              Conditions
            </Text>
          </Row>
        </Column>
      </Block>
    </Screen>
  );
}
