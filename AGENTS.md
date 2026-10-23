# AGENTS.md — quizup-mobile

> Application mobile **Expo SDK 57 + Expo UI universal**. Phase actuelle : **écrans
> branchés sur identity et le BFF** ; le mode démo mocké reste disponible explicitement
> pour les tests locaux. L'IA est calquée sur la version actuelle de `quizup-web`.

---

## 1. Rôle

Application mobile QuizUp :

- **5 onglets natifs** : **Accueil · Sujets · Social · Défis · Profil**.
- **Notifications** : plus d'onglet ; accessibles par la **cloche des headers** (badge
  non-lus) → `/notifications`.
- **Défis** : défis reçus/envoyés + salons, badge « pending ».
- Fiche sujet (`/topics/[id]`), fiche joueur (`/players/[id]`), réglages (`/settings`),
  recherche globale (`/search`).
- **Duel bot natif** : `POST /api/rooms/bot` depuis la fiche sujet, salon de préparation
  (`/rooms/[id]`), arène (`/games/[id]`) et résultat (`/games/[id]/result`) ; reprise
  d'une partie active depuis l'accueil.
- **Login** OTP / Google / Facebook ; en mode démo, une session factice est créée.
- Données BFF réelles ; mocks disponibles uniquement en mode démo local.

Hors périmètre immédiat : duel humain/appariement public, upload média, rédaction de
questions, push OS (tokens FCM/APNs et store builds), i18n complète.

---

## 2. Stack

- **Expo SDK 57**, React Native 0.86, **expo-router** (`unstable-native-tabs`).
- **`@expo/ui` (universal)** comme unique design system : SwiftUI sur iOS, Compose
  (Material 3) sur Android.
- **Un seul `Host` par écran**, porté par `Screen`.
- **Thème natif** : `useNativeColors()` → `PlatformColor` (iOS),
  `useMaterialColors` (Android), couleurs système CSS (web).
- **TanStack Query** (état serveur), **Zustand** (session), **Zod** (schémas),
  **`@stomp/stompjs`** (push live BFF `/ws/websocket`, connexion mutualisée).
- **Headers natifs** : chaque onglet a un `Stack` natif (`TabStack`), les détails sont
  poussés sur le **root stack** (tab bar masquée).
- **`expo-symbols`** (+ `expo-font`) pour les icônes des headers natifs.
- Architecture feature-based : `domain` (types + règles pures) → `lib` (services) →
  `hooks` (React Query) → `pages`/`components`.

```
app/
  _layout.tsx                 # Root Stack + providers + gating
  login.tsx                   # plein écran
  notifications.tsx           # cloche → inbox
  settings.tsx                # apparence + notifications
  search.tsx                  # recherche sujets/joueurs
  topics/[id].tsx             # fiche sujet (root stack)
  players/[id].tsx            # fiche joueur (root stack)
  rooms/[id].tsx              # salon de préparation
  games/[id]/index.tsx        # arène de duel
  games/[id]/result.tsx       # résultat du duel
  (tabs)/
    _layout.tsx               # NativeTabs : 5 onglets + badge Défis
    (home)/_layout.tsx + index.tsx
    (topics)/_layout.tsx + index.tsx
    (social)/_layout.tsx + index.tsx
    (challenges)/_layout.tsx + index.tsx
    (profile)/_layout.tsx + index.tsx
src/
  lib/                        # config, query client/keys, session, ws STOMP, préférences
  shared/                     # types/api, composants d'état, utils
  features/
    auth/                     # domain, lib, stores, hooks, pages
    home/                     # domain, lib, hooks, pages
    topics/                   # catalogue : domain, lib, hooks, components, pages
    topic/                    # fiche sujet : hooks, pages
    player/                   # domain, lib, hooks, components, pages
    social/                   # hooks, pages (annuaire)
    profile/                  # domain, lib, hooks, pages
    challenges/               # domain, lib, hooks, pages (défis + salons)
    rooms/                    # domain, lib, hooks, pages (préparation de salle)
    game/                     # domain (fold notifications), lib, hooks, pages (arène + résultat)
    settings/                 # domain (accents), pages
    search/                   # pages
    notifications/            # domain, lib, hooks, components, pages
  components/                 # design system Expo UI
    screen.tsx                # UNIQUE Host + ScrollView + refresh
    layout/                   # TabStack, HeaderActions, Section, Carousel, Grid
    fragments/                # Text, Button, Card, Chip, Switch…
  providers/                  # QueryProvider, ThemeProvider
  theme/                      # couleurs natives
  mocks/                      # db typée + scénarios (phase démo)
```

---

## 3. Règles (à respecter impérativement)

1. **`Screen` est l'unique `Host`** : un seul pont natif par écran. Ne jamais
   instancier de `Host` ailleurs.
2. **Tout le contenu d'un écran est natif** : `Section`, `Carousel`, `Grid`, `Row`,
   `Column`, `Spacer` et les fragments. Aucune vue RN dans le Host.
3. **`app/` n'importe ni `react-native` ni `@expo/ui`** : uniquement `@/components`,
   `@/features`, `@/lib`, `@/shared`, `@/providers`, `@/theme`.
   Garde : `npm run check:boundaries`.
4. **Aucune palette, aucun hex dans `src/`** (hors couleurs de contenu des mocks,
   seeds d'accent et badges de marque). `useNativeColors()` uniquement.
5. **Aucun token `space`/`radius`** : les valeurs de layout vivent dans
   `Screen`/`layout`/`fragments`, jamais dans les pages.
6. **Les contrôles natifs** (`Button`, `TextField`, `Switch`, onglets) héritent du Host
   (`seedColor` + `colorScheme`) : ne jamais figer leurs couleurs.
7. **Thème** : `ThemeProvider` porte `scheme` + `seed`, **persistés dans SecureStore**.
   Les réglages permettent Système/Clair/Sombre + palette d'accents curatée.
8. **Accessibilité / Dynamic Type** : `AppText` utilise les styles natifs iOS et les
   `sp` Android. Les composites interactifs exigent un `accessibilityLabel` ; les
   décoratifs passent par `accessibility.ts` ; `AppSwitch` annonce son état.
9. **Architecture feature-based** : `domain/` sans React/fetch, `lib/` = services,
   `hooks/` = React Query, `pages/` = composition, `components/` = UI de feature.
   Aucun `fetch` dans un composant.
10. **Anatomie** : imports → types → constantes → composant → export nommé ;
    un composant par fichier ; fichiers en kebab-case.
11. **IA** : 5 onglets (Accueil, Sujets, Social, Défis, Profil) ; notifications par la
    cloche ; détails sur le root stack (tab bar masquée) ; headers natifs ; badge
    Défis = défis reçus + salons en attente ; badge cloche = non-lus. Le duel bot
    enchaîne fiche sujet → salon → arène → résultat ; l'arène masque le header et
    désactive le geste de retour (sortie par abandon confirmé). L'inbox, les salles
    et l'arène combinent l'historique REST et le push STOMP (`/topic/notifications/{userId}`,
    `/topic/rooms/{id}`, `/topic/games/{id}`) ; le polling REST reste le filet de
    rattrapage après déconnexion et ne change pas le fold `GameState`. La connexion
    est coupée en arrière-plan (`AppState`) et rejouée au retour.
12. **Mode réel par défaut** : `EXPO_PUBLIC_AUTH_MODE=identity` et
    `EXPO_PUBLIC_DATA_SOURCE=api`. Pour la démo locale uniquement, forcer les deux à
    `mock` ; `EXPO_PUBLIC_MOCK_SCENARIO=success|empty|error`. Chaque service a alors
    son adaptateur `*.mock.ts` ; les écrans/hooks restent inchangés. Un chip « Démo »
    signale le mode dans Profil.
13. Contraintes connues : `List` n'est pas lazy, `Icon` ne rend pas sur le web,
    `matchContents` est figé au montage.
14. **SwiftUI est iOS-only** : ne jamais importer `@expo/ui/swift-ui` dans un fichier
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
- Les builds réels utilisent identity + BFF par défaut ; ne jamais livrer un build
  avec `EXPO_PUBLIC_AUTH_MODE=mock` ou `EXPO_PUBLIC_DATA_SOURCE=mock`.
- Secrets : `QUIZUP_GITHUB_TOKEN`, `ANDROID_KEYSTORE_*` ; keystore local hors dépôt.
- `versionCode = major*1e6 + minor*1e3 + patch` (voir `app.config.js`).

---

## 6. Hygiène

- **Aucun fichier `.env*` versionné** (seul `.env.example` l'est).
- Aucun secret dans un commit, un écran ou un commentaire.
- Toute image/asset doit provenir du dépôt (`assets/`) — pas d'URL externe.
