# AGENTS.md — quizup-mobile

> ⚠️ **Migration BFF en cours.** Plusieurs écrans restent branchés sur l'ancienne surface
> (gateway supprimée : `/theme-service`, `/social-service`, `/game-service`,
> `/matchmaking-service`, `POST /search`). La cible est la surface BFF `/api/**` décrite dans
> `services/quizup-bff/AGENTS.md` § 3 (salles, notifications, badges/titres, signalements).
> **Livrés** : distribution APK prod sur `main` (§ 3), auth **native** OTP email, Google
> Android et **Facebook natif** Android/iOS (§ 4 — key hashes Meta à vérifier). Les écrans existants seront
> migrés lot par lot vers la surface BFF ; les incréments branchés sont `/api/me`
> (`app/spike.tsx`), `/api/home` (**Accueil**), **Profil/Réglages**, **Sujets** et
> **Fiche sujet** (overview, suivi, classement, historique).

> Interface **mobile React Native (Expo)** de QuizUp — **UI v3 HeroUI Native + Uniwind**,
> mobile-only, alignée sur la **disposition et le rendu visuel de `quizup-web`** sans importer
> ses composants ni son CSS. La logique auth/BFF est conservée. Conventions :
> `best-practices/.frontend/` + `FIDELITY.md`.

---

## 1. Rôle

Application mobile QuizUp. **UI v3 = alignement web + 5 onglets** :

- Auth **native** : OTP email (`/api/auth/mobile/**`) + Google natif Android + **Facebook
  natif** Android/iOS. Aucun navigateur, aucune WebView, aucun cookie.
- Onglets : **Accueil**, **Sujets**, **Social**, **Notifications**, **Profil**.
- « Jouer » est **contextuel** (Accueil / Fiche sujet), pas un onglet.
- Écrans v2.0 : Accueil, Sujets, Fiche sujet, Profil, Réglages, Social et Notifications
  (états « Bientôt » en attendant M3/M4).
- Duel v2.1 livré : Salle, Arène, Résultat, Matchmaking.
- En cours (UI v3) : pilote Accueil + Fiche sujet + tab bar flottante + Dialog HeroUI.
- À venir : Social complet (M3) ; inbox et progression (M4) ; STOMP/push (M5).

Hors périmètre : création de sujets/questions, mur de thème/chat.

---

## 2. Stack & structure

- Expo SDK 57, React Native 0.86, expo-router, **HeroUI Native 1.0.10**,
  **Uniwind 1.13 + Tailwind CSS v4**, React Query, Zustand, Zod + React Hook Form,
  `@react-native-google-signin/google-signin`, `react-native-fbsdk-next`, `expo-secure-store`.
- **UI** : composants HeroUI Native (`Button`, `Card`, `Chip`, `TextField`, `Input`,
  `SearchField`, `BottomSheet`, `Switch`, `Avatar`, `Spinner`, `Typography`, `Toast`…).
  Les composants spécifiques (carte sujet, barre de progression) ne sont créés qu'en cas de
  besoin réel ; **aucun composant graphique importé ou copié de `quizup-web`**.
- **Thème** : HeroUI conservé, tokens visuels alignés sur le web (Inter, surfaces, rayons,
  bordures, couleurs, densité) ; thème système clair/sombre. Aucun composant/CSS web importé.
- **Web** : HeroUI Native n'est pas recommandé pour le web ; la cible est **Android/iOS**.
  Le preview web reste un outil de debug ponctuel, pas une cible produit.

```
app/                       # expo-router (couche mince)
  _layout.tsx  index.tsx
  (auth)/{_layout,login}.tsx
  (app)/{_layout,index,topics,social,notifications,profile,settings}.tsx
  (app)/topic/[id].tsx
src/
  features/{auth,home,topics,topic,profile,social,notifications,duel}/
  shared/{components,hooks,types,utils}/
  lib/{api-client,api,endpoints,auth,services,toast,query-client}/
```

Chaîne : **écran → hook React Query → service → API client**. La couche données (BFF,
folds, polling) est partagée avec les lots suivants ; seuls les écrans changent.

---

## 3. Commandes

```bash
npm install
npm start          # Expo Dev Server (Expo Go : OTP uniquement)
npm run android    # build natif de dev (Google requis) — expo run:android
npm run ios        # idem iOS (Google à configurer plus tard)
npm run web        # debug web ponctuel (HeroUI Native n'est pas la cible web)
npm run typecheck  # tsc --noEmit
npm run doctor     # expo-doctor
```

Variables (`.env`) : `EXPO_PUBLIC_API_URL` (BFF), `EXPO_PUBLIC_OIDC_AUTHORITY`
(base identity locale, **injectée aussi par la CI en release**),
`EXPO_PUBLIC_IDENTITY_URL` (override explicite facultatif — **ne jamais mettre une URL
localhost dans le `.env` principal**, elle serait embarquée dans l'APK), `EXPO_PUBLIC_OIDC_CLIENT_ID`,
`EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` (client OAuth2 Web Google, audience des ID tokens),
`EXPO_PUBLIC_GOOGLE_SIGN_IN_ENABLED` (`false` masque Google sans retirer l'ID client),
`EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` / `EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME` (iOS, plus tard),
`EXPO_PUBLIC_FACEBOOK_APP_ID` (App ID Meta public), `EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN`
(Client Token public du SDK), `EXPO_PUBLIC_FACEBOOK_SIGN_IN_ENABLED` (`false` masque Facebook).
Le client Google n'a **aucun fallback en dur** : vide ⇒ bouton Google masqué.

**CI** : `.github/workflows/ci.yml` → workflow réutilisable
`quizup-reusable-workflows/.github/workflows/mobile-ci.yml@main` (commitlint, `npm ci
--legacy-peer-deps`, `npm run typecheck`, `expo-doctor`).

**Release** : `.github/workflows/release.yml` → workflow réutilisable `mobile-release.yml@main`.
Sur chaque push `main` (hors `.github/workflows/**` et `**.md`) :
1. **semantic-release** (profil `npm` partagé) — bump `package.json`/`package-lock.json`,
   `CHANGELOG.md`, commit `chore(release): X [skip ci]`, tag `vX.Y.Z`, release GitHub ;
2. **APK Android prod** — `expo prebuild` + `gradlew assembleRelease` (arm64), publiée en
   pre-release `apk-<run_id>` ; si une version a été créée, l'APK est aussi attachée à la
   release `vX.Y.Z`. Le module Google est autolinké ; le plugin iOS correspondant n'est ajouté
   que si `EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME` est défini. Le client OAuth Web Google est passé
   explicitement au workflow (`google-web-client-id`) et injecté dans
   `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` pour `expo prebuild` puis Gradle. L'input
   `oidc-authority` alimente **à la fois** `EXPO_PUBLIC_IDENTITY_URL` et
   `EXPO_PUBLIC_OIDC_AUTHORITY` (les deux étapes prebuild/Gradle) : l'APK ne doit jamais
   embarquer un `localhost`. Facebook est passé via `facebook-app-id` et
   `facebook-client-token` (variable de dépôt `QUIZUP_FACEBOOK_CLIENT_TOKEN`) : vide ⇒ bouton
   masqué et plugin natif non ajouté.
   **Ordre de déploiement** : pousser `quizup-reusable-workflows` (qui déclare l'input) **avant**
   un push `quizup-mobile` déclenchant la release, sinon l'appel du workflow rejette l'input.

La version applicative est celle de `package.json` (lue par `app.config.js`) ; le `versionCode`
Android est dérivé de la version sémantique (`major * 1e6 + minor * 1e3 + patch`) pour rester
strictement croissant, et le numéro de run CI est affiché dans le badge de build. L'APK pointe sur la prod
(`https://api.quizup.cnadjim.fr`, `https://identity.quizup.cnadjim.fr`), package
`fr.cnadjim.quizup`.

Secrets GitHub requis : `QUIZUP_GITHUB_TOKEN` (semantic-release + upload de l'APK) et
`ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`,
`ANDROID_KEY_PASSWORD`. Variable de dépôt (publique) : `QUIZUP_FACEBOOK_CLIENT_TOKEN`.
Le keystore local vit hors dépôt dans
`~/Homeware/quizup-secrets/quizup-preview.p12` : **le sauvegarder** (les secrets GitHub sont en
écriture seule) — sans lui, les APK déjà installées ne peuvent plus être mises à jour.
`fr.cnadjim.quizup` est un identifiant temporaire : il est **définitif côté store** ; changer de
domaine plus tard implique une nouvelle application (désinstallation/réinstallation en interne).

---

## 4. Authentification native (point sensible)

**Aucun navigateur, aucune WebView, aucun cookie.** L'écran de login est porté par l'app
(`features/auth/login-screen.tsx`) et identity émet directement les tokens via une surface
dédiée, préfixée par client :

1. `POST /api/auth/mobile/request-login-code` `{email}` → `202` (anti-énumération).
2. `POST /api/auth/mobile/login-with-code` `{email, code}` → `{userId, email, accessToken,
   refreshToken, tokenType, expiresIn}`.
   Ou `POST /api/auth/mobile/login-with-google` `{idToken}` (SDK Google natif Android).
   Ou `POST /api/auth/mobile/login-with-facebook` `{accessToken}` (Android, login classique)
   / `{idToken, nonce}` (iOS, Limited Login).
3. Tokens stockés dans **SecureStore** (`lib/auth.ts`) ; refresh sur `401` via le endpoint
   OIDC standard `POST /oauth2/token` (`grant_type=refresh_token&client_id=mobile`),
   single-flight et rotation du refresh token.
   - Un échec **transitoire** (réseau, 5xx, 429) ne purge **jamais** la session : le prochain
     appel réessaie. Seuls un refus définitif (`invalid_grant`, 400/401/403) la termine
     (`SessionRefreshError.definitive`).
   - Garde anti-course : un refresh en vol ne réécrit pas les tokens après un logout.
4. Logout : `POST /api/auth/mobile/logout` `{refreshToken}` → `204`, puis purge locale,
   `GoogleSignin.signOut()` et `LoginManager.logOut()` (Facebook) best-effort, purge du cache
   React Query.
5. Session restaurée au démarrage par `SessionRuntime` (layout racine) : les deep links vers
   `(app)` passent par la garde même sans passer par `app/index.tsx`. Les groupes `(auth)` et
   `(app)` redirigent selon `authenticated` ; après login, la destination est **`/(app)`
   (Accueil)**, sauf deep link `join/{roomId}` en attente, qui reprend la salle.
   Les fins de session `expired|suspended|unknownUser` (refresh définitif, `401`
   `unknownUser`, `403 accountSuspended`) sont affichées en bandeau sur le login ; le cache
   React Query est purgé pour ne jamais exposer les données du compte précédent.

Les access tokens sont les **mêmes JWT** que le flux web (mêmes claims `sub`, `user_id`,
`email`, `roles`, même audience) : le BFF ne change pas. Aucun ID token n'est émis pour le
mobile ; les scopes natifs sont `profile email`.

### Google Android — configuration Cloud (manuelle)

`@react-native-google-signin/google-signin` (module natif, **pas Expo Go**) utilise le client
OAuth2 **Web** comme `webClientId` (audience des ID tokens) ; le client **Android** n'est
jamais référencé dans le code, Google le résout par **package + SHA-1**.

**État actuel** : le client Android **n'est pas encore créé** ; l'écran de login affiche un
message explicite et l'OTP reste utilisable. Protocole à appliquer quand l'accès à la console
est disponible :

1. Projet Google Cloud **`270229696016`** (celui du client Web
   `270229696016-9u3916ckfcludqv77uiebgir65j3eurk.apps.googleusercontent.com`). Rôle
   `roles/oauthconfig.editor` (ou Owner/Editor) requis.
2. **Google Auth Platform → Branding / Audience / Data Access** : app `QuizUp`, audience
   `External` (ou `Internal`), scopes `openid`,
   `https://www.googleapis.com/auth/userinfo.email`,
   `https://www.googleapis.com/auth/userinfo.profile`.
   En mode **Testing**, ajouter le compte Google du téléphone dans **Test users**.
3. **Google Auth Platform → Clients → Create client → Android** :
   - nom `QuizUp Android release` ;
   - package `fr.cnadjim.quizup` ;
   - SHA-1 release
     `A7:86:D9:27:A3:D7:05:6D:AD:2C:F1:67:D5:A9:2F:87:00:4E:24:B4`.
   Ne pas créer ce client dans un autre projet : l'ID token doit garder l'audience du client
   Web existant. Aucun `google-services.json` ni secret n'est nécessaire.
4. Attendre la propagation (5 min à quelques heures), désinstaller/réinstaller l'APK.
5. Pour un build debug local, ajouter l'empreinte du debug keystore :
   `keytool -exportcert -rfc -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android | openssl x509 -noout -fingerprint -sha1`.
   Pour une distribution Play, ajouter l'empreinte **Play App Signing**.
6. Diagnostic : `npx @react-native-google-signin/config-doctor`, `apksigner verify --print-certs`
   sur l'APK, `adb logcat | grep -iE 'GoogleSignIn|DEVELOPER_ERROR'`. Un `DEVELOPER_ERROR`
   signifie package/SHA-1/projet incohérent ; l'app le traduit par un message actionnable.

L'OTP fonctionne aussi dans Expo Go ; Google nécessite un build natif/APK
(`npx expo run:android` ou l'APK de release).

### Facebook natif (Android + iOS Limited Login)

Le SDK `react-native-fbsdk-next` est **natif** (pas Expo Go, pas web). Le bouton n'apparaît
que si `EXPO_PUBLIC_FACEBOOK_APP_ID` **et** `EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN` sont fournis au
build ; sinon il est masqué et le plugin natif n'est **pas** ajouté (`app.config.js`).

- **Android** : login classique → access token Graph ; identity le vérifie via
  `/debug_token` (App ID + App Secret + `appsecret_proof`) puis `/me` (email).
- **iOS** : Limited Login → ID token OIDC + nonce ; identity vérifie signature, issuer,
  audience, expiration et nonce via le JWKS Facebook.
- Les deux flux retournent la **même session mobile** que l'OTP/Google (access + refresh).

**Configuration Meta** (App ID `2122240041993058`) :

1. Plateforme **Android** : package `fr.cnadjim.quizup`, key hash release
   `p4bZJ6PXBW2tLPFn1akvhwBOJLQ=` (SHA-1 release
   `A7:86:D9:27:A3:D7:05:6D:AD:2C:F1:67:D5:A9:2F:87:00:4E:24:B4`), key hash debug
   (commande ci-dessous). En mode **Development**, ajouter le compte Facebook du téléphone
   dans **Test users** (ou passer l'app en Live).
2. Plateforme **iOS** : bundle `fr.cnadjim.quizup`, Limited Login activé.
3. Key hash debug :
   ```bash
   keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore \
     -storepass android | openssl sha1 -binary | base64
   ```
   Un `Invalid key hash` dans le log Facebook signifie que le package/la key hash manque.

**Configuration mobile** :

- `.env` : `EXPO_PUBLIC_FACEBOOK_APP_ID=2122240041993058`,
  `EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN=<Client Token public>` (configuré),
  `EXPO_PUBLIC_FACEBOOK_SIGN_IN_ENABLED=true`.
- GitHub : variable de dépôt `QUIZUP_FACEBOOK_CLIENT_TOKEN` (configurée, consommée par
  `.github/workflows/release.yml`). **Vide = APK sans Facebook** (bouton masqué, plugin absent).
- Après changement : `npx expo prebuild --clean` puis build natif
  (`npx expo run:android` ou APK). Le plugin ajoute `facebook_app_id`,
  `facebook_client_token`, `fb_login_protocol_scheme`, `FacebookActivity` et
  `CustomTabActivity`.
- **Identity** : `QUIZUP_OAUTH2_FACEBOOK_SECRET` (App Secret) reste côté serveur — local
  `.env`, prod secret scellé `quizup-identity-facebook`. **Ne jamais** l'embarquer dans l'APK.

Erreurs identity : `401 urn:quizup:auth:invalidFacebookToken` (token invalide/expiré),
`422 urn:quizup:auth:facebookEmailMissing` (email absent), `503 urn:quizup:auth:facebookUnavailable`
(Facebook/identity indisponible). L'app retombe sur l'OTP/Google.

iOS sera ajouté plus tard (client iOS + URL scheme inversé via
`EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` / `EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME`).

---

## 5. Mapping backend

La cible est la **surface BFF `/api/**`** (voir `services/quizup-bff/AGENTS.md` § 3) ; l'ancienne
gateway et ses préfixes `/theme-service`, `/social-service`, `/game-service`,
`/matchmaking-service` ont disparu. La migration écran par écran est en cours ; les services
encore présents dans `src/lib/services` (ou isolés dans `src/lib/services/legacy`) ciblent
l'ancienne surface et ne doivent pas servir de référence.

**Incréments BFF branchés** : `GET /api/me` (`app/spike.tsx`), `GET /api/home` (**Accueil**),
**Profil/Réglages** (`/api/me` + `PUT /api/profiles/{id}/pseudonym|bio|country|language`),
**Sujets** (`GET /api/topics`, `/api/topics/facets`) et **Fiche sujet**
(`GET /api/topics/{id}/overview`, `/leaderboard`, `PUT|DELETE /follow`,
`GET /api/profiles/{id}/games?topicId=`). Les onglets Personnes, Fiche joueur, Défis et le duel
restent sur l'ancienne surface jusqu'à leurs lots M2/M3.

**Auth** : surface native `quizup-identity` `/api/auth/mobile/**` (voir § 4) + refresh OIDC
standard `/oauth2/token`. Les endpoints web `/api/auth/web/**` ne sont pas consommés par le
mobile.

---

## 6. Conventions UI v3

- **HeroUI-first** : utiliser en priorité `heroui-native` pour tout ce qui existe
  (Button, Card, Surface, Chip, Tabs, ListGroup, TextField, Input, InputOTP, SearchField,
  BottomSheet, Dialog, Alert, Switch, Avatar, Spinner, Skeleton, Toast, GlassView,
  PressableFeedback, ScrollShadow, Menu, Popover…). Ne pas réinventer un primitif.
- **Pas d'UI native custom** : remplacer `Alert.alert` par `Dialog`, `Pressable` par
  `PressableFeedback`, les modales par `Dialog`/`BottomSheet`. Les seules primitives RN
  restantes sont le layout (`View`/`ScrollView`/`FlatList`), la navigation Expo Router,
  les safe areas, le refresh, le partage et les haptiques.
- **Composant spécifique seulement si HeroUI n'a pas d'équivalent** : timer SVG, barre de
  progression, stepper de salle. Il reçoit des DTOs/view-models, ne fait pas de fetch.
- **Alignement web** : reprendre l'ordre des sections, la hiérarchie, les formats de cartes,
  la densité et les actions de `quizup-web` ; **ne jamais importer/copier ses composants,
  son CSS ou ses tokens**. Pas de parité pixel-perfect.
- **Structure des écrans** : `ScrollView`/`FlatList` RN + composants HeroUI ; safe areas via
  `useSafeAreaInsets` ; tab bar flottante HeroUI masquée sur les écrans immersifs.
- **Overlays** : `BottomSheet`, `Dialog`, `Toast` HeroUI. Aucun `Alert` natif.
- **Tactile** : cibles ≥ 44 px, feedback press, sheets pour les filtres/sélecteurs.
- **États** : loading (`Spinner`/`Skeleton`), empty, error, offline.
- **A11y** : labels, rôles, `accessibilityState`, contraste, tailles de texte.
- 1 composant = 1 fichier, export nommé, `interface` pour les props, **jamais `any`**.
- Server state React Query, UI state Zustand, local `useState`. Pas de fetch dans `useEffect`.

> **Fidélité** : la référence est la **disposition et le rendu visuel de `quizup-web`**,
> adaptés au mobile et reconstruits avec HeroUI. Le détail est dans `FIDELITY.md`.

---

## 7. État d'avancement — UI (v2 → v3)

### Livré (v2.0)

- **Socle UI v2** : HeroUI Native 1.0.10 + Uniwind 1.13 + Tailwind CSS v4.
  NativeWind v4/Tailwind 3, les primitifs maison et l'ancien thème `vars()` sont supprimés.
- **Navigation** : 5 onglets **Accueil / Sujets / Social / Notifications / Profil** ;
  « Jouer » reste contextuel (pas d'onglet). Route `topic/[id]` et `settings`.
- **Auth native reconstruite avec HeroUI** : OTP email, Google Android, Facebook natif
  (Android/iOS) ; mêmes endpoints, SecureStore, refresh, session et logout qu'avant.
- **Accueil** : sections, rails horizontaux, cartes sujets HeroUI, reprise de partie
  (`/api/games?active=true`), CTA « Explorer les sujets ».
- **Sujets** : `SearchField`, filtres en `BottomSheet` (suivis, catégories, tri), grille
  2 colonnes, facettes BFF, scroll infini.
- **Fiche sujet** : bannière/couverture, suivi, progression, maîtrise, stats, classement
  paginé et historique de parties.
- **Profil / Réglages** : profil, stats, compteurs, édition pseudonyme/bio/pays/langue,
  déconnexion.
- **Social / Notifications** : onglets présents avec états « Bientôt » designés,
  à remplir en M3/M4.
- **Couche données** : services BFF et hooks React Query conservés ; socle M2
  (rooms/games/matchmaking, folds game/room, polling) préparé pour v2.1.
- **Thème** : thème HeroUI par défaut + branding QuizUp minimal. Pas de reprise graphique
  de `quizup-web`.

### Livré (v2.1 — duel)

- **Play mode** : feuille HeroUI (bot / appariement public / salle privée), difficulté bot.
- **Salle** : stepper, présence, partage, wizz + cooldown, annulation/sortie, redirection
  automatique vers l'arène dès `GAME_CREATED`.
- **Arène** : scores, timer SVG, question localisée, réponses 2×2, reveal, abandon.
- **Résultat** : issue, scores, performance, XP/progression, rejouer bot / retour sujet.
- **Matchmaking** : recherche 10 s, expiration → relance / bot / retour, salle à `COMPLETED`.
- **Deep link** `quizup://join/{roomId}` + reprise après login (pending room).
- **Accueil** : bandeau « Partie en cours » branché sur `/api/games?active=true`.
- **Données** : folds `GameState`/notifications, polling REST, hooks salles/game/matchmaking.

### En cours (UI v3 — alignement web)

- **Socle** : Inter (5 graisses), thème HeroUI aligné sur les couleurs/rayons/bordures web,
  surfaces plates détourées, mode clair/sombre.
- **Navigation** : tab bar flottante HeroUI (`GlassView`, `PressableFeedback`, `Typography`),
  onglet actif qui déploie son libellé, masquée sur les écrans immersifs.
- **Accueil** : Top 10 en affiches, suivis/nouveaux en paysage, bandeau de reprise, sections
  dans l'ordre du web.
- **Fiche sujet** : header plein cadre, actions, progression, maîtrise, stats et tabs HeroUI.
- **Confirmations** : `Dialog` HeroUI global (plus d'`Alert.alert`).
- **Reste du pilote** : Auth, Sujets, Profil/Réglages, Salle/Arène/Résultat.

### Vérifié

| Contrôle | Résultat |
|---|---|
| `npm run typecheck` | ✅ (UI v2 + pilote v3) |
| `npx expo export --platform android` | ✅ (HeroUI + Uniwind + expo-router) |
| `npx expo export --platform web` | ✅ (debug uniquement ; cible non supportée par HeroUI Native) |
| `npx expo-doctor` | ✅ (21/21) |
| `npx expo prebuild --platform android` | ✅ (plugins Expo + Facebook) |
| Smoke Playwright web mobile (390×844), token injecté + BFF mocké | Login, Accueil, Sujets (recherche + filtres), Fiche sujet, Profil, Social/Notifications, **0 erreur non ignorée** |
| Smoke duel (390×844, BFF mocké) | Fiche sujet → play sheet → salle bot → arène → réponse → résultat, **0 erreur** |
| Smoke modes (matchmaking + salle privée) | Recherche → expiration → retour sujet ; création de salle privée + partage/fermeture, **0 erreur** |
| Smoke pilote UI v3 (390×844 + 320×568, clair/sombre) | Accueil, Fiche sujet, tab bar, notifications/profil, **0 erreur** |

### Non testé / restant

- **Runtime natif sur appareil** : l'APK v2.1 doit être installé et testé (auth, écrans,
  performances) — pas d'`adb`/émulateur dans l'environnement de dev courant.
- **UI v3** : valider le pilote Accueil/Fiche sujet, puis généraliser Auth, Sujets, Profil et
  les écrans de duel ; Social M3 ensuite.
- **Facebook** : Client Token configuré ; valider sur appareil après key hashes Meta
  (release `p4bZJ6PXBW2tLPFn1akvhwBOJLQ=` + debug) et app Live / Test users.
- **Google** : client Android Cloud encore à créer (§ 4).
- **HeroUI Native** : valider le rendu/natif sur Android réel (le preview web n'est pas
  représentatif ; `colorKit` peut loguer des warnings web).
- **Social / Notifications** : M3/M4.
- **Duel sur appareil** : valider l'arène en temps réel, le wizz reçu et l'appariement
  humain complet sur APK (le smoke web couvre le bot, l'expiration et la salle privée).
- **STOMP / push** : M5 (les écrans utilisent encore le polling REST).
- **Web** : hors cible produit tant que HeroUI Native est utilisé.

### Dépendances notables

`expo-router`, `heroui-native`, `uniwind` + `tailwindcss@4`, `@gorhom/bottom-sheet`,
`react-native-gesture-handler`, `react-native-reanimated` (+ `react-native-worklets`),
`expo-image`, `expo-haptics`, `expo-blur`, `expo-system-ui`, `expo-secure-store`,
`@react-native-google-signin/google-signin`, `react-native-fbsdk-next`,
`@tanstack/react-query`, `zustand`, `react-hook-form` + `zod`, `lucide-react-native`.
