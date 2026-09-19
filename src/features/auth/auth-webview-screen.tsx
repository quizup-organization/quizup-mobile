import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import type { ShouldStartLoadRequest } from "react-native-webview/lib/WebViewTypes";
import { ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/text";
import { exchangeAuthorizationCode } from "@/lib/auth";
import { useSessionStore } from "./session-store";

/**
 * WebView d'autorisation OIDC. Partage le cookie jar natif avec le `POST /api/auth/login`
 * effectué juste avant : `/oauth2/authorize` émet alors directement le code, intercepté sur
 * la redirection `quizup://callback`.
 */
export function AuthWebViewScreen() {
  const router = useRouter();
  const { authorizeUrl, pkceVerifier, setSession, clearPkce } = useSessionStore();
  const [error, setError] = useState<string | null>(null);

  if (!authorizeUrl || !pkceVerifier) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Text className="text-sm text-muted-foreground">
          Session d'autorisation manquante.
        </Text>
      </View>
    );
  }

  function onShouldStart(request: ShouldStartLoadRequest): boolean {
    if (!request.url.startsWith("quizup://callback")) return true;

    const query = request.url.split("?")[1] ?? "";
    const params = new URLSearchParams(query);
    const code = params.get("code");

    if (!code) {
      setError("Code d'autorisation absent.");
      return false;
    }

    void (async () => {
      try {
        await exchangeAuthorizationCode(code, pkceVerifier as string);
        setSession(true);
        clearPkce();
        router.replace("/(app)");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Échec de la connexion");
      }
    })();
    return false;
  }

  return (
    <View className="flex-1 bg-background">
      {error ? (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-sm text-destructive">{error}</Text>
        </View>
      ) : (
        <WebView
          source={{ uri: authorizeUrl }}
          onShouldStartLoadWithRequest={onShouldStart}
          startInLoadingState
          renderLoading={() => (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator />
            </View>
          )}
        />
      )}
    </View>
  );
}
