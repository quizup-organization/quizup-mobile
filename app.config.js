const packageJson = require("./package.json");

const [major = 1, minor = 0, patch = 0] = packageJson.version
  .split(".")
  .map((part) => Number.parseInt(part, 10) || 0);

/**
 * `versionCode` Android dérivé de la version sémantique (`major * 1e6 + minor * 1e3 + patch`).
 * Il reste strictement croissant d'une release à l'autre.
 */
const semanticVersionCode = major * 1_000_000 + minor * 1_000 + patch;

/**
 * Configuration Expo dynamique : la version applicative suit le `package.json` (bumpée par
 * semantic-release) ; le reste vient de `app.json`.
 */
module.exports = ({ config }) => ({
  ...config,
  version: packageJson.version,
  android: {
    ...config.android,
    package: process.env.ANDROID_PACKAGE ?? config.android?.package,
    versionCode: Number(process.env.ANDROID_VERSION_CODE ?? semanticVersionCode),
  },
});
