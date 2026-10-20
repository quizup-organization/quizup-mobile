# FIDELITY — quizup-mobile v3 (HeroUI Native aligné web)

> **Référence : la disposition et le rendu visuel de `quizup-web`, adaptés au mobile.**
> Tous les composants restent **HeroUI Native**. Aucun composant, CSS ou token web n'est
> importé ou copié. La cible n'est **pas** le pixel-perfect desktop.

## Principes

- **HeroUI-first** : `Button`, `Card`, `Surface`, `Chip`, `Tabs`, `ListGroup`, `TextField`,
  `Input`, `InputOTP`, `SearchField`, `BottomSheet`, `Dialog`, `Alert`, `Switch`, `Avatar`,
  `Spinner`, `Skeleton`, `Toast`, `GlassView`, `PressableFeedback`, `ScrollShadow`, `Menu`,
  `Popover`… avant toute primitive custom.
- **Pas d'UI native custom** : `Alert.alert` → `Dialog` ; `Pressable` → `PressableFeedback` ;
  modales → `Dialog`/`BottomSheet`. Restent natifs uniquement le layout
  (`View`/`ScrollView`/`FlatList`), Expo Router, les safe areas, `RefreshControl`, `Share`
  et les haptiques.
- **Disposition web** : ordre des sections, hiérarchie, formats de cartes, densité,
  actions et états de `quizup-web`, adaptés à 320–390 px.
- **Mobile-only** : Android/iOS sont la cible. Le web n'est qu'un debug ponctuel.
- **États complets** : loading, empty, error, offline, disabled, sélectionné.
- **Tactile** : cibles ≥ 44 px, feedback press, safe areas, clair/sombre.

## Navigation

5 onglets : **Accueil · Sujets · Social · Notifications · Profil**.
Tab bar flottante HeroUI : verre dépoli, onglet actif qui déploie son libellé, masquée sur
les écrans immersifs (salle, arène, résultat, matchmaking).
« Jouer » reste contextuel (Accueil, Fiche sujet), pas un onglet.

## Direction visuelle

- **Socle** : Inter (400/500/600/700/800), surfaces plates avec bordure fine, grands rayons,
  aucune ombre au repos.
- **Couleurs** : fond blanc / `#121212`, surfaces `#ffffff` / `#1f1f1f`, primaire indigo,
  muted, bordures `#e5e5e5` / `#2e2e2e`.
- **Duel** : arène sombre `#0b0b0b`, surfaces blanches, score ambre, timer bleu, correct vert,
  mauvaise réponse rouge.
- **Éditorial** pour découvrir ; **arcade sombre** pour le duel.
- **Pas de reprise** des composants web, du CSS web ou de la densité desktop.

## Composants spécifiques (HeroUI ne couvre pas)

- `TopicCard` (formats grille / affiche / paysage).
- `ProgressBar` (pas de Progress HeroUI).
- `UserAvatar` (Avatar HeroUI + repli initiales).
- `TimerRing` (SVG), `RoomStepper`, `AnswerCard`.
- `ConfirmDialog` (host HeroUI global, remplace `Alert.alert`).

Règles : 1 fichier par composant, export nommé, `interface` pour les props, jamais `any`,
pas de fetch dans un composant de présentation.

## Quality gate

- 390×844 et 320×568.
- clair/sombre.
- loading / empty / error / offline.
- cibles 44 px, contraste, labels a11y.
- 60 fps, listes virtualisées, images `expo-image`.
- `npm run typecheck`, `npx expo export --platform android`, `npx expo-doctor`.
- Le smoke web est un bonus de debug, **pas un critère de parité**.

## Hors périmètre

Parité pixel-perfect avec `quizup-web`, import de composants shadcn/web, CSS web,
sidebar/topbar desktop, NativeWind, ⌘K.
