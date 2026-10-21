# AGENTS.md — quizup-mobile

> Application mobile **Expo SDK 57 + Expo UI universal**. Phase actuelle : **écrans
> alimentés par des mocks typés** (auth démo incluse), avant le branchement BFF.
> L'objectif est de valider tous les écrans sans aucun appel réseau, puis de remplacer
> les services mockés par le client BFF sans toucher aux écrans.

---

## 1. Rôle

Application mobile QuizUp :

- 5 onglets natifs : **Accueil · Sujets · Social · Alertes · Profil**.
- Fiche sujet (`/topic/[id]`).
- **Login** OTP / Google / Facebook ; en mode démo, une session factice est créée.
- Données mockées tant que le BFF n'est pas branché (voir § 3.11).

Hors périmètre immédiat : rooms/duel/arène, temps réel STOMP, WebSocket, upload média,
rédaction de questions, push OS, i18n complète.

---

## 2. Stack

- **Expo SDK 57**, React Native 0.86, **expo-router** (`unstable-native-tabs`).
- **`@expo/ui` (universal)** comme unique design system : SwiftUI sur iOS, Compose
  (Material 3) sur Android.
- **Un seul `Host` par écran**, porté par `Screen` : seule frontière entre l'arbre
  React Native et l'arbre natif.
- **Thème natif** : aucune palette. `useNativeColors()` → `PlatformColor` (iOS),
  `useMaterialColors` (Android), couleurs système CSS (web).
- **TanStack Query** pour l'état serveur, **Zustand** pour l'état client partagé
  (session/auth), **Zod** pour les schémas de formulaire.
- Architecture feature-based alignée sur `quizup-web` :
  `domain` (types + règles pures) → `lib` (services) → `hooks` (React Query) →
  `pages`/`components`.
- Police système (SF Pro / Roboto). Aucun design system JS, aucun `className`.

```
app/
  _layout.tsx                 # providers + gating (routes minces)
  login.tsx                   # → features/auth/pages/login-page
  (tabs)/_layout.tsx          # onglets natifs (accent du thème)
  (tabs)/{index,topics,social,notifications,profile}.tsx
  topic/[id].tsx              # → features/topic/pages/topic-page
src/
  lib/                        # infrastructure uniquement
    config.ts                 # URLs, modes mock/identity/api, scénarios
    query-client.ts query-keys.ts session.ts
  shared/
    types/api.ts              # Page, ApiError
    components/               # LoadingState, ErrorState, EmptyState
    utils/                    # format, pagination
  features/
    auth/
      domain/{session,errors,gateway}.ts
      lib/{gateway,identity,mock-gateway,providers,storage}.ts
      stores/use-session-store.ts
      hooks/use-auth.ts
      components/session-bootstrap.tsx
      pages/login-page.tsx
      schemas.ts index.ts
    home/                     # domain, lib, hooks, pages
    topics/                   # catalogue : domain, lib, hooks, pages, components
    topic/                    # fiche sujet : hooks, pages
    player/                   # domain, lib, hooks, components (PlayerRow)
    social/                   # hooks, pages (annuaire)
    profile/                  # domain, lib, hooks, pages
    notifications/            # domain, lib, hooks, pages, components
  mocks/                      # db typée + scénarios (temporaire, phase démo)
  components/                 # design system Expo UI
    screen.tsx                # UNIQUE Host + ScrollView RN + refresh + largeur
    layout/                   # PageHeader, Section, Carousel, Grid, Row/Column/Spacer
    fragments/                # Text, Button, Card, Chip, Avatar, Switch…
  providers/                  # QueryProvider, ThemeProvider
  theme/                      # couleurs natives
```

---

## 3. Règles (à respecter impérativement)

1. **`Screen` est l'unique `Host`** : un seul pont natif par écran. Ne jamais
   instancier de `Host` ailleurs.
2. **Tout le contenu d'un écran est natif** : `PageHeader`, `Section`, `Carousel`,
   `Grid`, `Row`, `Column`, `Spacer` et les fragments. Aucune vue RN dans le Host.
3. **`app/` n'importe ni `react-native` ni `@expo/ui`** : uniquement `@/components`,
   `@/features`, `@/lib`, `@/shared`, `@/providers`, `@/theme`.
   Garde : `npm run check:boundaries`.
4. **Aucune palette, aucun hex dans `src/`** (hors couleurs de contenu des mocks et
   badges de marque Google/Facebook). `useNativeColors()` uniquement.
5. **Aucun token `space`/`radius`** : les valeurs de layout vivent dans
   `Screen`/`layout`/`fragments`, jamais dans les pages.
6. **Les contrôles natifs** (`Button`, `TextField`, onglets, `Switch`) héritent du
   Host (`seedColor` + `colorScheme`) : ne jamais figer leurs couleurs.
7. `ThemeProvider` porte le schéma et le `seed` optionnel (futur sélecteur de thème).
8. **Accessibilité / Dynamic Type** : `AppText` utilise les styles natifs iOS et les
   `sp` Android ; ne pas fixer de `fontSize` hors `text.tsx`. Les composites
   interactifs exigent un `accessibilityLabel` ; les décoratifs passent par
   `accessibility.ts`.
9. **Architecture feature-based** : `domain/` sans React/fetch, `lib/` = services,
   `hooks/` = React Query, `pages/` = composition, `components/` = UI de feature.
   Aucun `fetch` dans un composant.
10. **Anatomie** : imports → types → constantes → composant → export nommé ;
    un composant par fichier ; fichiers en kebab-case.
11. **Phase démo** : `EXPO_PUBLIC_AUTH_MODE=mock` (auth démo) et
    `EXPO_PUBLIC_DATA_SOURCE=mock` (services mockés) par défaut.
    `EXPO_PUBLIC_MOCK_SCENARIO=success|empty|error` pour les états.
    Les services mockés vivent dans `features/<x>/lib/` et devront être remplacés par
    les services BFF ; les écrans/hooks restent inchangés. Un chip « Démo » signale
    le mode dans Profil.
12. Contraintes connues : `List` n'est pas lazy, `Icon` ne rend pas sur le web,
    `matchContents` est figé au montage.
13. **SwiftUI est iOS-only** : ne jamais importer `@expo/ui/swift-ui` dans un fichier
    partagé ; les helpers plateforme ont un override `.android.ts`/`.web.ts`.

---

## 4. Commandes

```bash
npm install
npm start                # dev server
npm run android          # build natif de dev
npm run ios              # build natif iOS
npm run typecheck        # tsc --noEmit
npm run check:boundaries # app/ sans react-native ni @expo/ui
npm run doctor           # expo-doctor
```

---

## 5. CI / release

- **Convention de commit** : `feat(mobile):` → release **minor** ;
  `fix(mobile):` / `perf(mobile):` → **patch**. `refactor`, `docs`, `chore` ne créent
  pas de version sémantique (APK per-push quand même publié).
- `ci.yml` → job `boundaries` + workflow réutilisable `mobile-ci.yml`.
- `release.yml` → `mobile-release.yml` : semantic-release, prebuild Android, APK
  pre-release `apk-<run_id>`.
- Avant une vraie release : passer `EXPO_PUBLIC_AUTH_MODE=identity` et
  `EXPO_PUBLIC_DATA_SOURCE=api`.
- Secrets : `QUIZUP_GITHUB_TOKEN`, `ANDROID_KEYSTORE_*` ; keystore local hors dépôt.
- `versionCode = major*1e6 + minor*1e3 + patch` (voir `app.config.js`).

---

## 6. Hygiène

- **Aucun fichier `.env*` versionné** (seul `.env.example` l'est).
- Aucun secret dans un commit, un écran ou un commentaire.
- Toute image/asset doit provenir du dépôt (`assets/`) — pas d'URL externe.
