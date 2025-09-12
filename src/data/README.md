# Configuration des marqueurs personnalisés

## Propriétés disponibles pour les lieux

Chaque lieu dans le fichier `data.json` peut maintenant avoir des propriétés pour personnaliser l'apparence de son marqueur sur la carte :

### `markerColor` (optionnel)

- **Type :** `string`
- **Description :** Couleur personnalisée pour le marqueur
- **Format :** Toute valeur CSS valide (hex, rgb, nom de couleur, etc.)
- **Défaut :** `var(--color-secondary)` (orange terre)

### `markerIcon` (optionnel)

- **Type :** `string`
- **Description :** Icône personnalisée pour le marqueur
- **Format :** Classe FontAwesome (sans le préfixe "fas ")
- **Défaut :** `fa-map-marker-alt` (défini dans la config)

## Exemples d'utilisation

```json
{
  "id": "statue-la-quintinie",
  "latitude": 48.79908106692258,
  "longitude": 2.1213753776846027,
  "markerColor": "#8B4513",
  "markerIcon": "fa-monument",
  "content": {
    // ... contenu habituel
  }
}
```

## Couleurs suggérées

- **Statues/Monuments :** `#8B4513` (marron)
- **Jardins/Nature :** `#32CD32` (vert)
- **Éducation/École :** `#2E8B57` (vert mer)
- **Points de vue :** `#4169E1` (bleu royal)
- **Bâtiments :** `#DC143C` (rouge)

## Icônes suggérées

- **Statues :** `fa-monument`, `fa-user`
- **Jardins :** `fa-seedling`, `fa-leaf`, `fa-tree`
- **Éducation :** `fa-user-graduate`, `fa-school`
- **Points de vue :** `fa-binoculars`, `fa-eye`
- **Bâtiments :** `fa-building`, `fa-home`
- **Fontaines :** `fa-fountain`

## Comportement

- Si `markerColor` n'est pas spécifié, la couleur par défaut sera utilisée
- Si `markerIcon` n'est pas spécifié, l'icône par défaut sera utilisée
- Lors du survol/clic (état actif), la couleur passe automatiquement à `var(--color-warm)` (orange chaud)
- Les propriétés personnalisées sont ignorées en état actif pour maintenir la cohérence visuelle
