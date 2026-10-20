const packageJson = require("./package.json");

const [major = 1, minor = 0, patch = 0] = packageJson.version
  .split(".")
  .map((part) => Number.parseInt(part, 10) || 0);

/**
 * `versionCode` Android dérivé de la version sémantique (`major * 1e6 + minor * 1e3 + patch`).
 * Il reste strictement croissant d'une release à l'autre, indépendamment du numéro de run CI
 * (qui, lui, est affiché dans le badge de build).
 */
const semanticVersionCode = major * 1_000_000 + minor * 1_000 + patch;

/**
 * Configuration Expo dynamique : la version applicative suit le `package.json` (bumpée par
 * semantic-release) ; le reste vient de `app.json` via `config`.
 *
 * <p>Le plugin Google Sign-In n'est ajouté que lorsqu'un client iOS est configuré : Android
 * n'a besoin d'aucun fichier Firebase, le module natif est autolinké. Pour iOS, fournir
 * `EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME` (URL scheme inversé du client iOS).</p>
 */
module.exports = ({ config }) => {
  const plugins = [...(config.plugins ?? [])];
  const googleIosUrlScheme = process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME;
  if (googleIosUrlScheme) {
    plugins.push([
      "@react-native-google-signin/google-signin",
      { iosUrlScheme: googleIosUrlScheme },
    ]);
  }

  // Facebook : le plugin n'est ajouté que si l'App ID et le Client Token publics
  // sont fournis au build. Sans eux, le bouton est masqué et le SDK natif absent.
  const facebookAppId = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID;
  const facebookClientToken = process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN;
  if (facebookAppId && !facebookClientToken) {
    console.warn(
      "[facebook] EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN absent : bouton masqué et plugin natif non ajouté.",
    );
  }
  if (!facebookAppId && facebookClientToken) {
    console.warn(
      "[facebook] EXPO_PUBLIC_FACEBOOK_APP_ID absent : bouton masqué et plugin natif non ajouté.",
    );
  }
  if (facebookAppId && facebookClientToken) {
    plugins.push([
      "react-native-fbsdk-next",
      {
        appID: facebookAppId,
        clientToken: facebookClientToken,
        displayName: "QuizUp",
        scheme: `fb${facebookAppId}`,
        advertiserIDCollectionEnabled: false,
        autoLogAppEventsEnabled: false,
        isAutoInitEnabled: true,
      },
    ]);
  }

  return {
    ...config,
    version: packageJson.version,
    plugins,
    android: {
      ...config.android,
      package: process.env.ANDROID_PACKAGE ?? config.android?.package,
      versionCode: Number(process.env.ANDROID_VERSION_CODE ?? semanticVersionCode),
    },
  };
};
