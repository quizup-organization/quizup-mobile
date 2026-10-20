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
- `@expo/material-symbols` pour les icônes Android (SF Symbols côté iOS).
- **Police système** (SF Pro / Roboto). Aucune police custom, aucun token web.
- Aucun design system JS : ni HeroUI, ni NativeWind/Uniwind, ni Tailwind, ni `className`.
- Les écrans métier restent sur `src/data/fixtures.ts` ; seuls les appels d'auth
  (`identity`) sortent du téléphone.

```
app/
  _layout.tsx                 # Stack racine + AuthProvider + gating + StatusBar
  login.tsx                   # Login OTP + Google + Facebook (Expo UI universel)
  (tabs)/_layout.tsx          # onglets natifs
  (tabs)/{index,topics,social,notifications,profile}.tsx
  topic/[id].tsx              # fiche sujet (hors onglets)
src/
  auth/config.ts              # URLs identity + IDs publics Google/Facebook
  auth/errors.ts              # AuthError / AuthCancelledError
  auth/identity.ts            # Endpoints mobiles (OTP, social, refresh, logout)
  auth/providers.ts           # SDK natifs Google / Facebook
  auth/storage.ts             # Session dans expo-secure-store
  auth/types.ts               # Session / réponses identity
  auth/AuthProvider.tsx       # État de session + login/refresh/logout
  ui/theme.ts                 # palette clair/sombre, rayons, espacements
  ui/icons.tsx                # registre Icon.select (SF Symbol / Material Symbol)
  ui/primitives.tsx           # Screen, Block, Inline, Section, AppText, AppButton, AppTextField…
  data/fixtures.ts            # sujets, classement, amis, notifications, profil
```

---

## 3. Règles UI (à respecter impérativement)

1. **Tout composant Expo UI doit être dans un `Host`** : utiliser `Block` (largeur 100 %),
   `Inline` (dimensionné au contenu) ou `Screen` (écran complet).
2. **Pas de Yoga dans un `Host`** : ni `flex`, ni `margin`, ni `gap`, ni ombre, ni
   gradient, ni position absolue. Mise en page = `spacing`, `padding`, `borderRadius`,
   `borderWidth`, `width`/`height`.
3. React Native ne sert qu'à la **structure** : `ScrollView`, `View`, `useWindowDimensions`,
   safe areas. Jamais de style visuel RN.
4. Un seul design system : les couleurs passent par `useColors()` (`src/ui/theme.ts`).
5. `Host` reçoit `seedColor` + `colorScheme` pour aligner les contrôles natifs.
6. Contraintes connues : `List` n'est **pas lazy** (garder `FlatList` pour les longues
   listes), `Icon` ne rend pas sur le web, `matchContents` est figé au montage.
7. **SwiftUI est iOS-only** : sur Android, les composants universels rendent du Compose.
   Ne jamais importer `@expo/ui/swift-ui` dans un fichier partagé.

---

## 4. Commandes

```bash
npm install
npm start          # dev server
npm run android    # build natif de dev (obligatoire : Expo UI est un module natif)
npm run ios        # build natif iOS
npm run typecheck  # tsc --noEmit
npm run doctor     # expo-doctor
```

---

## 5. CI / release

- `ci.yml` → workflow réutilisable `quizup-reusable-workflows/mobile-ci.yml@main`
  (commitlint, `npm ci --legacy-peer-deps`, typecheck, expo-doctor).
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
