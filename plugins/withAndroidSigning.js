const { withAppBuildGradle } = require("@expo/config-plugins");

/**
 * Signale à Expo prebuild d'utiliser le keystore de release fourni par la CI.
 *
 * Sans ce patch, le build `assembleRelease` généré par Expo utilise
 * `signingConfigs.debug` : l'APK est signé avec le certificat debug, ce qui casse
 * l'authentification Google (SHA-1) et Facebook (key hash).
 *
 * Le plugin ne s'active que si `ANDROID_KEYSTORE_PATH` est présent. Le workflow
 * mobile décode le keystore secret dans `$RUNNER_TEMP` et exporte cette variable
 * avant `expo prebuild`.
 */
function withAndroidSigning(config) {
  if (!process.env.ANDROID_KEYSTORE_PATH) {
    return config;
  }

  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    if (!contents.includes("signingConfigs.release")) {
      if (!contents.includes("signingConfigs {")) {
        throw new Error(
          "withAndroidSigning: bloc `signingConfigs` introuvable dans android/app/build.gradle",
        );
      }

      contents = contents.replace(
        "signingConfigs {",
        `signingConfigs {
        release {
            storeFile file(System.getenv("ANDROID_KEYSTORE_PATH"))
            storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD")
            keyAlias System.getenv("ANDROID_KEY_ALIAS")
            keyPassword System.getenv("ANDROID_KEY_PASSWORD")
        }`,
      );
    }

    const patched = contents.replace(
      /(release\s*\{[^}]*?signingConfig\s+)signingConfigs\.debug/s,
      "$1signingConfigs.release",
    );

    if (patched === contents) {
      throw new Error(
        "withAndroidSigning: impossible de remplacer signingConfigs.debug dans le buildType release",
      );
    }

    config.modResults.contents = patched;
    return config;
  });
}

module.exports = withAndroidSigning;
