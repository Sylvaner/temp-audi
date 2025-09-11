# Éditeur de Lieux - Open Audio Guide

Cet outil permet de créer et modifier facilement les données de lieux pour votre application de guide audio.

## Utilisation

1. Ouvrez `tools/index.html` dans votre navigateur
2. Cliquez sur "Charger data.json" pour charger le fichier existant depuis `src/data/data.json`
3. Utilisez la carte interactive pour :
   - Cliquer pour ajouter un nouveau lieu
   - Voir tous les lieux existants avec des marqueurs
4. Pour chaque lieu, vous pouvez :
   - Modifier les coordonnées GPS
   - Ajouter/modifier le contenu dans plusieurs langues
   - Spécifier le fichier audio MP3

## Structure des données

```json
{
  "config": {
    "map": {
      "center": {
        "latitude": 48.8566,
        "longitude": 2.3522
      },
      "zoom": 13
    }
  },
  "places": [
    {
      "id": "identifiant-unique",
      "latitude": 48.8566,
      "longitude": 2.3522,
      "content": {
        "fr": {
          "title": "Titre du lieu",
          "description": "Description courte",
          "text": "Texte complet du guide audio",
          "audioFile": "nom-fichier.mp3"
        },
        "en": {
          "title": "Place title",
          "description": "Short description",
          "text": "Full audio guide text",
          "audioFile": "filename.mp3"
        }
      }
    }
  ]
}
```

## Fonctionnalités

- **Carte interactive** : Cliquez pour placer des lieux (curseur en croix)
- **Multi-langues** : Support pour autant de langues que nécessaire
- **Édition simple** : Interface intuitive avec Bulma CSS
- **Configuration de carte** : Définissez le centre initial et le zoom par défaut
- **Sauvegarde** : Télécharge le fichier JSON modifié avec la configuration
- **Visualisation** : Voir tous les lieux sur la carte
- **Navigation** : Liste latérale pour accès rapide aux lieux

## Technologies utilisées

- Vue 3 (CDN)
- Leaflet (cartes interactives)
- Bulma CSS (interface)
- Fichier HTML unique (simplicité maximale)

## Installation

Aucune installation requise ! Ouvrez simplement le fichier HTML dans votre navigateur.

## Workflow recommandé

1. Modifiez vos lieux avec l'éditeur
2. Sauvegardez le fichier JSON
3. Remplacez le contenu de `src/data/data.json` avec le nouveau fichier
4. Votre application aura accès aux nouvelles données
