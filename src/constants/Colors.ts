/**
 * Palette du template `expo-template-tabs`.
 *
 * C'est l'unique source de couleurs de l'application : aucun autre fichier ne
 * doit définir de valeur hexadécimale (hors couleurs de contenu des fixtures).
 */
const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

const Colors = {
  light: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
  },
};

export type ColorSchemeName = keyof typeof Colors;
export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export default Colors;
