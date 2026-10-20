const { withAppBuildGradle } = require("@expo/config-plugins");

const RELEASE_SIGNING_CONFIG = `
        release {
            storeFile file(System.getenv("ANDROID_KEYSTORE_PATH"))
            storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD")
            keyAlias System.getenv("ANDROID_KEY_ALIAS")
            keyPassword System.getenv("ANDROID_KEY_PASSWORD")
        }`;

/**
 * Injecte une configuration de signature `release` lue depuis l'environnement.
 * No-op en local quand `ANDROID_KEYSTORE_PATH` n'est pas défini : `expo prebuild`
 * continue d'utiliser la signature debug.
 */
module.exports = function withAndroidReleaseSigning(config) {
  return withAppBuildGradle(config, (config) => {
    if (!process.env.ANDROID_KEYSTORE_PATH) {
      return config;
    }

    let contents = config.modResults.contents;

    if (!contents.includes("signingConfigs.release")) {
      contents = contents.replace(
        /signingConfigs\s*\{/,
        (match) => `${match}${RELEASE_SIGNING_CONFIG}`
      );
    }

    contents = contents.replace(
      /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)signingConfig\s+signingConfigs\.debug/,
      "$1signingConfig signingConfigs.release"
    );

    config.modResults.contents = contents;
    return config;
  });
};
