const packageJson = require("./package.json");
const withAndroidSigning = require("./plugins/withAndroidSigning");

const [major = 1, minor = 0, patch = 0] = packageJson.version
  .split(".")
  .map((part) => Number.parseInt(part, 10) || 0);

/**
 * `versionCode` Android dérivé de la version sémantique (`major * 1e6 + minor * 1e3 + patch`).
 * Il reste strictement croissant d'une release à l'autre.
 */
const semanticVersionCode = major * 1_000_000 + minor * 1_000 + patch;

const googleIosClientId = (
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? ""
).trim();
const facebookAppId = (process.env.EXPO_PUBLIC_FACEBOOK_APP_ID ?? "").trim();
const facebookClientToken = (
  process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN ?? ""
).trim();

const googleIosUrlScheme = googleIosClientId
  ? `com.googleusercontent.apps.${googleIosClientId.replace(
      /\.apps\.googleusercontent\.com$/,
      "",
    )}`
  : null;

/**
 * Configuration Expo dynamique : la version applicative suit le `package.json` (bumpée par
 * semantic-release) ; le reste vient de `app.json`. Les plugins natifs d'authentification ne
 * sont ajoutés que lorsque leurs identifiants publics sont fournis, pour garder les builds
 * locaux sans configuration fonctionnels (les boutons correspondants restent désactivés).
 */
module.exports = ({ config }) => {
  const plugins = [...(config.plugins ?? []), "expo-secure-store", withAndroidSigning];

  if (googleIosUrlScheme) {
    plugins.push([
      "@react-native-google-signin/google-signin",
      { iosUrlScheme: googleIosUrlScheme },
    ]);
  }

  if (facebookAppId) {
    plugins.push([
      "react-native-fbsdk-next",
      {
        appID: facebookAppId,
        ...(facebookClientToken ? { clientToken: facebookClientToken } : {}),
        displayName: "QuizUp",
        scheme: `fb${facebookAppId}`,
        isAutoInitEnabled: true,
        autoLogAppEventsEnabled: false,
        advertiserIDCollectionEnabled: false,
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
      versionCode: Number(
        process.env.ANDROID_VERSION_CODE ?? semanticVersionCode,
      ),
    },
    ios: {
      ...config.ios,
      // Build TestFlight strictement croissant, aligné sur le versionCode Android.
      buildNumber: process.env.IOS_BUILD_NUMBER ?? String(semanticVersionCode),
    },
  };
};
