# Places Editor - Marker Customization

## Nouvelle fonctionnalité : Personnalisation des marqueurs

L'éditeur de lieux permet maintenant de personnaliser l'apparence des marqueurs directement depuis l'interface web.

### Fonctionnalités ajoutées

#### 1. **Champs de personnalisation**

- **Couleur du marqueur** : Sélecteur de couleur + champ texte pour CSS
- **Icône du marqueur** : Menu déroulant + champ texte pour FontAwesome

#### 2. **Presets rapides**

Boutons prédéfinis pour les combinaisons courantes :

- 🏛️ **Monument** : Marron + icône monument
- 🌱 **Jardin** : Vert + icône pousse
- 🎓 **Éducation** : Vert mer + icône diplômé
- 👁️ **Point de vue** : Bleu + icône jumelles
- 🏢 **Bâtiment** : Rouge + icône building
- ↩️ **Reset** : Remet aux valeurs par défaut

#### 3. **Aperçus visuels**

- Aperçu du marqueur à côté du titre lors de l'édition
- Mini-icônes dans la liste des lieux sur la droite
- Popup améliorée sur la carte avec les infos de personnalisation

#### 4. **Marqueurs interactifs**

- Marqueurs sur la carte utilisant les couleurs et icônes personnalisées
- Style cohérent avec ombre et bordure blanche
- Mise à jour automatique lors des modifications

### Utilisation

1. **Sélectionner un lieu** existant ou cliquer sur la carte pour en créer un
2. **Personnaliser le marqueur** :
   - Utiliser le sélecteur de couleur ou taper une valeur CSS
   - Choisir une icône dans le menu ou taper une classe FontAwesome
   - Ou cliquer sur un preset rapide
3. **Voir le résultat** immédiatement sur la carte et dans les aperçus
4. **Sauvegarder** le fichier JSON avec les personnalisations

### Format de données

Les nouvelles propriétés sont ajoutées au JSON :

```json
{
  "id": "mon-lieu",
  "latitude": 48.123,
  "longitude": 2.456,
  "markerColor": "#32CD32",
  "markerIcon": "fa-seedling",
  "content": { ... }
}
```

### Compatibilité

- ✅ Compatible avec les fichiers JSON existants
- ✅ Les propriétés sont optionnelles (valeurs par défaut si absentes)
- ✅ Nouveau format utilisable directement dans l'application Vue.js
