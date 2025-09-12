# Configuration des marqueurs par défaut

## Nouveautés implémentées

### 1. Configuration globale dans `data.json`

Ajout d'une nouvelle section `markers` dans la configuration :

```json
{
  "config": {
    "markers": {
      "defaultColor": "#B87333",
      "defaultIcon": "fa-map-marker-alt"
    }
  }
}
```

### 2. Interface d'édition dans `tools/index.html`

Dans la section **Configuration**, nouveaux champs pour :

- **Couleur par défaut** : Sélecteur de couleur + champ texte
- **Icône par défaut** : Menu déroulant + champ texte libre
- **Aperçu** : Visualisation du marqueur par défaut

### 3. Logique intelligente

#### Dans l'application Vue.js (`LeafletMap.vue`) :

- Utilise `place.markerColor` si défini, sinon `config.markers.defaultColor`
- Utilise `place.markerIcon` si défini, sinon `config.markers.defaultIcon`
- Préserve le comportement actif/inactif existant

#### Dans l'éditeur (`tools/app.js`) :

- Charge automatiquement la configuration depuis le fichier JSON
- Initialise les valeurs par défaut si absentes
- Met à jour les marqueurs en temps réel

### 4. Hiérarchie des priorités

Pour chaque marqueur, l'ordre de priorité est :

1. **Propriétés spécifiques du lieu** (`markerColor`, `markerIcon`)
2. **Configuration par défaut** (`config.markers.defaultColor`, `config.markers.defaultIcon`)
3. **Valeurs fallback** (`#B87333`, `fa-map-marker-alt`)

### 5. Compatibilité

- ✅ **Rétrocompatible** : Fonctionne avec les fichiers JSON existants
- ✅ **Valeurs par défaut** : Initialisation automatique des propriétés manquantes
- ✅ **Migration automatique** : Pas d'action requise pour les projets existants

## Utilisation

### Configuration globale

1. Charger un fichier JSON dans l'éditeur
2. Aller dans la section **Configuration**
3. Modifier **Default Marker Color** et **Default Marker Icon**
4. Voir l'aperçu mis à jour
5. Sauvegarder le fichier

### Personnalisation par lieu

1. Sélectionner un lieu dans l'éditeur
2. Utiliser les champs **Marker Color** et **Marker Icon**
3. Ou utiliser les presets rapides
4. Les valeurs personnalisées priment sur les valeurs par défaut

## Exemple complet

```json
{
  "places": [
    {
      "id": "lieu-avec-marqueur-personnalise",
      "markerColor": "#FF6B35",
      "markerIcon": "fa-star"
    },
    {
      "id": "lieu-avec-marqueur-par-defaut"
      // Utilisera config.markers.defaultColor et config.markers.defaultIcon
    }
  ],
  "config": {
    "markers": {
      "defaultColor": "#2E8B57",
      "defaultIcon": "fa-monument"
    }
  }
}
```

Dans cet exemple :

- Le premier lieu aura un marqueur orange avec une étoile
- Le second lieu aura un marqueur vert avec un monument (valeurs par défaut)
