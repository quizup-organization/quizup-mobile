# FIDELITY — quizup-mobile ↔ product/maquettes

Objectif : **fidélité maximale** à la maquette (structure, tokens, libellés, iconographie),
avec adaptation des interactions desktop au natif.

## 1:1

- **Tokens** : couleurs (converties oklch → hex), rayons, typographie — mêmes valeurs sémantiques.
- **Composants** : `TopicIcon`, `TopicCard`, `TopicCarousel`, `StatStrip`, `WinLossBar`, `Progress`,
  `SectionHeader`, `Card`, `Button`, `Input`, `Avatar`, `Badge`.
- **Écrans** : Accueil (bandeaux de sujets), Sujets (recherche + facettes + pagination),
  Fiche sujet (bannière, 3 stats, onglets Classement / Ta progression), Profil (identité + stats V/N/D).
- Libellés FR, iconographie `lucide-react-native`.

## Adapté (natif)

| Maquette web | Mobile |
|---|---|
| Sidebar repliable + Topbar | Onglets bas (`Tabs`) |
| Palette ⌘K | Recherche en tête de l'écran Sujets |
| `DropdownMenu` / `Select` / `Tooltip` | Boutons / listes / modales (à venir) |
| Hover / focus ring | `pressed` |
| Carrousel scroll-x | `FlatList` horizontale |
| Bannière + onglets collants | Sections dans un `ScrollView` |

## Hors Lot 1

Mur de thème/chat. La bascule de thème Clair/Sombre/Système et l'**édition du profil** sont
disponibles dans l'écran **Réglages**. Le **Lot 2** ajoute Personnes, Fiche joueur, Défis
(**création depuis la fiche joueur** incluse), l'arène de duel (bot + humain) et la recherche
d'adversaire.
