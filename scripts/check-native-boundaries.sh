#!/bin/sh
set -eu

# Les écrans ne doivent jamais créer de frontière native ni de layout RN :
# Screen est l'unique Host Expo UI, et les structures RN vivent dans src/.
if grep -rnE 'from "(react-native|@expo/ui)"' app; then
  echo "" >&2
  echo "Erreur : app/ importe react-native ou @expo/ui directement." >&2
  echo "Utilise @/components (Screen, layout, fragments) à la place." >&2
  exit 1
fi

echo "OK : aucun import react-native ou @expo/ui dans app/."
