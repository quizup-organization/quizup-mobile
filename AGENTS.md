# AGENTS.md — quizup-mobile

> Interface **mobile React Native (Expo)** de QuizUp — Expo Router + NativeWind + primitifs
> « shadcn pour RN » (méthode react-native-reusables). Conventions : `best-practices/.frontend/`.

---

## 1. Rôle

Application mobile QuizUp. **Lot 1 = Fondations + catalogue** :

- Auth OIDC (Authorization Code + PKCE) via WebView partageant le cookie `AUTH_TX`.
- Onglets : **Accueil**, **Sujets**, **Personnes**, **Défis**, **Profil**.
- Écrans : **Accueil**, **Sujets** (recherche/filtres/pagination), **Fiche sujet** (suivi, classement, progression, lancement de duel bot), **Personnes** (abonnements/abonnés), **Fiche joueur**, **Défis**, **Arène de duel** (bot + humain via matchmaking), **Recherche d'adversaire**, **Réglages** (édition du profil, thème, déconnexion).

Hors périmètre : création de sujets/questions, mur de thème/chat.

---

## 2. Stack & structure

- Expo SDK 57, React Native 0.86, expo-router, NativeWind v4 (Tailwind 3), React Query, Zustand,
  Zod + React Hook Form, `expo-auth-session`, `expo-secure-store`, `react-native-webview`.

```
app/                       # expo-router (couche mince)
  _layout.tsx  index.tsx
  (auth)/{_layout,login,verify-code}.tsx
  auth-webview.tsx
  (app)/{_layout,index,topics,profile}.tsx  (app)/topic/[id].tsx
src/
  features/{auth,shell,home,topics,topic}/
  shared/{hooks,types,utils}/
  components/{ui,}          # primitifs + composites (façon RNR)
  lib/{api-client,api,endpoints,auth,pkce,theme,services}/
```

Même chaîne que le web : **écran → hook React Query → service → API client**.
Les types, services et hooks React Query sont **identiques au web** (dossier `src/lib`, `src/shared`).

---

## 3. Commandes

```bash
npm install
npm start          # Expo Dev Server
npm run android    # ou ios / web
npm run typecheck  # tsc --noEmit
npm run doctor     # expo-doctor
```

Variables (`.env`) : `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_OIDC_AUTHORITY`, `EXPO_PUBLIC_OIDC_CLIENT_ID`.

**CI** : `.github/workflows/ci.yml` — `npm ci --legacy-peer-deps`, `npm run typecheck`, `expo-doctor`
(pas de build web/Docker pour le mobile).

---

## 4. Authentification (point sensible)

1. `POST {identity}/api/auth/request-code` puis `POST /api/auth/verify-code` (stack réseau natif →
   cookie `AUTH_TX` dans le jar natif).
2. `expo-crypto` génère le couple PKCE (verifier/challenge S256).
3. WebView (`react-native-webview`) charge `/oauth2/authorize` (jar partagé → session vue) et
   intercepte la redirection `quizup://callback?code=…`.
4. Échange `POST /oauth2/token` (PKCE) puis stockage des tokens dans **SecureStore**.

Client public `mobile` déclaré dans `quizup-identity` (`quizup://callback`, PKCE requis).

---

## 5. Mapping backend

Identique au web (gateway `:8080`), plus : `GET /social-service/api/user-follows/*` (préparé).
Voir `web-applications/quizup-web/AGENTS.md` § 4.

---

## 6. Conventions & fidélité

- Tokens maquette convertis en **hex** (oklch non supporté par RN) et appliqués via `vars()`.
- Fidélité : structure/typo/couleurs **1:1** ; interactions desktop adaptées (menus → listes/boutons,
  hover → pressed). Détail dans `FIDELITY.md`.
- 1 composant = 1 fichier, export nommé, `interface` pour les props, **jamais `any`**.
- Server state React Query, UI state Zustand, local `useState`. Pas de fetch dans `useEffect`.

---

## 7. État d'avancement — Lot 1 (Fondations + catalogue)

### Livré

- **Scaffold** : Expo SDK 57, React Native 0.86, expo-router, TypeScript strict, alias `@/*`.
- **Design system** : NativeWind v4 (Tailwind 3) ; tokens maquette convertis oklch → hex et appliqués
  via `vars()` (`lib/theme.ts`) ; palette concrète pour les styles impératifs (`tabBarStyle`).
  Primitifs façon RNR : `Button`, `Card`, `Input`, `Text`, `Avatar`, `Badge`, `Progress`, et
  composites `TopicIcon`, `TopicCard`, `TopicCarousel`, `SectionHeader`, `Screen`, `StatStrip`, `WinLossBar`.
- **Couche données** : `lib/api-client` (fetch RN, sans `URL`/`URLSearchParams`), `endpoints`,
  services + hooks React Query **identiques au web** (`lib/services`, `features/*/hooks`).
- **Auth** : `POST /api/auth/request-code` + `verify-code` (OTP email) → PKCE S256 (`lib/pkce.ts`) →
  **WebView** partageant le cookie `AUTH_TX` → `/oauth2/authorize` → interception `quizup://callback`
  → `/oauth2/token`. Stockage via `lib/storage.ts` (SecureStore natif / `localStorage` web).
- **Navigation** : `app/` expo-router — `(auth)/login|register`, `auth-webview`, `(app)` onglets
  **Accueil / Sujets / Profil**, routes `topic/[id]` et `settings`.
- **Écrans** : Accueil (bandeaux suivis + tendances), Sujets (recherche debouncée, facettes
  catégories calculées côté client, pagination), Fiche sujet (icône, suivi, classement réel,
  progression, historique, lancement de duel bot), **Personnes** (abonnements/abonnés),
  **Fiche joueur** (suivre, stats V/N/D, duels communs), **Défis** (reçus+envoyés, accept/refus,
  Jouer), **Arène de duel** (bot + humain, polling), **Recherche d'adversaire**, Profil,
  **Réglages** (thème, déconnexion).

### Vérifié

| Contrôle | Résultat |
|---|---|
| `npm run typecheck` | ✅ |
| `npx expo export --platform android` | ✅ (Metro + NativeWind + expo-router) |
| `npx expo export --platform web` | ✅ |
| Smoke Playwright web mobile (390×844), token réel injecté | Accueil, onglets Sujets/Personnes/Défis, sujet → duel bot, **0 erreur console** |

### Non testé / restant

- **Auth native sur appareil** (WebView + cookie `AUTH_TX`) : le flux n'a pas été exécuté sur
  émulateur/appareil — **point #1 à valider**. Adressage via `.env` (`localhost` / `10.0.2.2` / IP LAN).
- `expo-doctor` non exécuté.
- Duel : **bot + humain**, mais en **polling** (WS non branché côté mobile).
- WebSocket non branché côté mobile (arène en polling ~1,5 s).

### Dépendances notables

`expo-router`, `nativewind` + `tailwindcss@3`, `@tanstack/react-query`, `zustand`,
`react-hook-form` + `zod`, `expo-auth-session`, `expo-secure-store`,
`@react-native-async-storage/async-storage`, `react-native-webview`, `react-native-reanimated`
(+ `react-native-worklets` requis par le plugin Babel), `lucide-react-native`.
