# AGENTS.md — quizup-mobile

> Application mobile **Expo SDK 57 + Expo UI (universal)**. L'**authentification
> native est branchée** (OTP email, Google, Facebook) ; le reste de l'interface
> utilise encore des **données factices locales**. Objectif : valider l'interface
> native (SwiftUI sur iOS, Material 3 sur Android) tout en préparant le rebranchement BFF.

---

## 1. Rôle

Application mobile QuizUp :

- 5 onglets natifs : **Accueil · Sujets · Social · Alertes · Profil**.
- Fiche sujet (`/topic/[id]`) et partie « démo » simulée.
- **Login** (`/login`) : OTP email, Google natif et Facebook natif ; session
  QuizUp persistée dans `expo-secure-store` (access + refresh tokens).
- Les écrans métier restent alimentés par `src/data/fixtures.ts`.

Hors périmètre pour l'instant : BFF métier, duel réel, notifications temps réel,
web, administration.

---

## 2. Stack

- **Expo SDK 57**, React Native 0.86, **expo-router** (`unstable-native-tabs`).
- **`@expo/ui` (universal)** comme unique design system : les mêmes composants rendent
  SwiftUI sur iOS et Jetpack Compose (Material 3) sur Android.
- **Un seul `Host` par écran**, porté par `Screen` : c'est la seule frontière
  entre l'arbre React Native et l'arbre natif.
- **Thème natif** : aucune palette. `useNativeColors()` résout les rôles vers
  `PlatformColor` (iOS), `useMaterialColors` (Android) et les couleurs système CSS (web).
- `@expo/material-symbols` pour les icônes Android (SF Symbols côté iOS).
- **Police système** (SF Pro / Roboto). Aucune police custom, aucun token web.
- Aucun design system JS : ni HeroUI, ni NativeWind/Uniwind, ni Tailwind, ni `className`.

```
app/
  _layout.tsx                 # Stack racine + ThemeProvider + AuthProvider + gating
  login.tsx                   # Login OTP + Google + Facebook
  (tabs)/_layout.tsx          # onglets natifs (accent du thème)
  (tabs)/{index,topics,social,notifications,profile}.tsx
  topic/[id].tsx              # fiche sujet (hors onglets)
src/
  auth/                       # session, providers natifs, endpoints identity
  components/
    screen.tsx                # UNIQUE Host + ScrollView RN + contexte de largeur
    layout/
      stack.tsx               # Row / Column / Spacer (fragments Expo UI)
      page-header.tsx         # en-tête d'écran
      section.tsx             # section titrée
      carousel.tsx            # ScrollView native horizontale
      grid.tsx                # grille native (lignes de Row)
    fragments/
      text.tsx card.tsx chip.tsx avatar.tsx progress-bar.tsx dot.tsx
      icon-tile.tsx icon.tsx icons.tsx row.tsx
      button.tsx text-field.tsx social-button.tsx
    index.ts                  # barrel unique : les écrans importent depuis "@/components"
  hooks/
    use-color-scheme.ts       # + use-color-scheme.web.ts
    use-content-width.ts      # largeur de contenu bornée (480)
  providers/theme-provider.tsx # schéma + seed optionnel (préparation du picker)
  theme/
    types.ts                  # contrat sémantique (aucune valeur)
    native-colors.ts          # iOS PlatformColor + web couleurs système
    native-colors.android.ts  # Material 3 (useMaterialColors)
    index.ts                  # useNativeColors()
  data/fixtures.ts            # sujets, classement, amis, notifications, profil
```

---

## 3. Règles UI (à respecter impérativement)

1. **`Screen` est l'unique `Host`** : un seul pont natif par écran. Ne jamais
   instancier de `Host` ailleurs (`Block`/`Inline` n'existent plus).
2. **Tout le contenu d'un écran est natif** : `PageHeader`, `Section`, `Carousel`,
   `Grid`, `Row`, `Column`, `Spacer` et les fragments. Aucune vue RN dans le Host.
3. **`app/` n'importe ni `react-native` ni `@expo/ui`** : uniquement `@/components`,
   `@/auth`, `@/data`, `@/hooks`, `@/providers`, `@/theme`.
   Garde : `npm run check:boundaries` (job CI `boundaries`).
4. **Aucune palette, aucun hex dans `src/`** (hors couleurs de contenu des fixtures
   et badges de marque Google/Facebook). `useNativeColors()` uniquement :
   - iOS : `PlatformColor("systemBackground" | "secondarySystemBackground" |
     "tertiarySystemFill" | "label" | "secondaryLabel" | "tintColor" | "white" |
     "systemRed")` ;
   - Android : `useMaterialColors({ colorScheme, seedColor })` (Material You si
     pas de seed) ;
   - web : `Canvas`, `CanvasText`, `GrayText`, `ButtonFace`, `Highlight`,
     `HighlightText`.
5. **Aucun token `space` ni `radius`** : les valeurs de layout vivent dans
   `Screen`/`layout/`/`fragments/`, jamais dans les écrans.
6. **Les contrôles natifs** (`Button`, `TextField`, onglets) héritent du Host :
   `seedColor` + `colorScheme` du `ThemeProvider`. Ne jamais figer leurs couleurs.
7. `ThemeProvider` porte le schéma (clair/sombre/système) et le `seed` optionnel :
   point d'entrée du futur sélecteur de thème (WhatsApp-like), pas encore exposé.
8. **Un composant par fichier** dans `components/`, exporté par le barrel `index.ts`.
9. Contraintes connues : `List` n'est **pas lazy** (garder `FlatList` pour les longues
   listes), `Icon` ne rend pas sur le web, `matchContents` est figé au montage.
10. **SwiftUI est iOS-only** : sur Android, les composants universels rendent du Compose.
    Ne jamais importer `@expo/ui/swift-ui` dans un fichier partagé.

---

## 4. Commandes

```bash
npm install
npm start               # dev server
npm run android         # build natif de dev (Expo UI est un module natif)
npm run ios             # build natif iOS
npm run typecheck       # tsc --noEmit
npm run check:boundaries # app/ sans react-native ni @expo/ui
npm run doctor          # expo-doctor
```

---

## 5. CI / release

- **Convention de commit** : `feat(mobile):` déclenche une release **minor** ;
  `fix(mobile):` / `perf(mobile):` une release **patch**. `refactor(mobile):`,
  `docs:` et `chore:` ne créent **aucune version sémantique** (l'APK per-push
  `apk-<run_id>` est quand même publié). Toute implémentation doit donc utiliser
  `feat`/`fix` pour déclencher une release.
- `ci.yml` → job `boundaries` (garde des frontières natives) + workflow réutilisable
  `quizup-reusable-workflows/mobile-ci.yml@main` (commitlint, `npm ci --legacy-peer-deps`,
  typecheck, expo-doctor).
- `release.yml` → `mobile-release.yml@main` : semantic-release (profil `npm`) puis
  `expo prebuild` + `gradlew assembleRelease` (arm64), APK en pre-release `apk-<run_id>`.
- Secrets requis : `QUIZUP_GITHUB_TOKEN` (org), `ANDROID_KEYSTORE_*` (repo).
  Keystore local hors dépôt : `~/Homeware/quizup-secrets/quizup-preview.p12`.
- Variables publiques de release : `QUIZUP_FACEBOOK_CLIENT_TOKEN` (Client Token Meta)
  et `QUIZUP_GOOGLE_IOS_CLIENT_ID` (client OAuth iOS). Vides = boutons sociaux
  correspondants désactivés et plugin natif non ajouté.
- `versionCode = major*1e6 + minor*1e3 + patch` (voir `app.config.js`).

---

## 6. Hygiène

- **Aucun fichier `.env*` versionné** (seul `.env.example` l'est).
- Aucun secret dans un commit, un écran ou un commentaire.
- Toute image/asset doit provenir du dépôt (`assets/`) — pas d'URL externe.
