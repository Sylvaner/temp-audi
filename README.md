# 🎧 Open Audio Guide

> Une application web progressive pour guides audio interactifs avec cartographie Leaflet et support multilingue

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite)](https://vite.dev/)
[![Pinia](https://img.shields.io/badge/Pinia-2.x-FFD859?logo=pinia)](https://pinia.vuejs.org/)

## 🚀 Aperçu

Open Audio Guide est une application Vue.js moderne qui transforme la découverte de lieux en expérience interactive immersive. Combinant cartographie Leaflet, guides audio multilingues et interface accessible, elle offre une solution complète pour le tourisme culturel et éducatif.

### ✨ Fonctionnalités principales

- **🗺️ Cartographie interactive** - Navigation Leaflet avec marqueurs personnalisés
- **🎵 Guides audio multilingues** - Lecture synchronisée avec contrôles avancés
- **📱 Progressive Web App** - Expérience native sur mobile et desktop
- **♿ Accessibilité WCAG 2.1 AA** - Navigation clavier et lecteurs d'écran
- **🌐 Support multilingue** - i18n avec Vue I18n (FR/EN extensible)
- **📍 Géolocalisation** - Centrage automatique et navigation contextuelle
- **⚡ Performance optimisée** - Lazy loading et code splitting
- **🎨 Design responsive** - Interface Bulma CSS adaptive

## 🏗️ Architecture

### Stack technique

```
Frontend:     Vue 3 + Composition API + TypeScript
State:        Pinia stores avec composables
Styling:      Bulma CSS + FontAwesome + CSS Variables
Maps:         Leaflet + OpenStreetMap
Build:        Vite + Vue-tsc + ESLint
Testing:      Vitest + Vue Test Utils
```

### Structure du projet

```
src/
├── components/          # Composants Vue réutilisables
│   ├── map/            # Composants cartographiques
│   ├── navigation/     # Navigation et routing
│   └── ui/             # Elements d'interface
├── composables/        # Logique métier réutilisable
├── stores/             # Stores Pinia (état global)
├── views/              # Pages de l'application
├── router/             # Configuration Vue Router
├── i18n/               # Configuration internationalisation
├── types/              # Définitions TypeScript
├── utils/              # Utilitaires et helpers
├── data/               # Données JSON statiques
└── styles/             # Variables et styles CSS
```

## 🛠️ Installation et développement

### Prérequis

- **Node.js** 18+
- **npm** 9+

### Setup rapide

```bash
# Installation des dépendances
npm install

# Démarrage en développement
npm run dev

# L'application sera disponible sur http://localhost:5173
```

### Scripts disponibles

```bash
# Développement
npm run dev              # Serveur de développement avec hot-reload
npm run preview          # Preview de la build de production

# Build et déploiement
npm run build            # Build optimisée pour production
npm run type-check       # Vérification TypeScript

# Qualité de code
npm run lint             # ESLint avec auto-fix
npm run test:unit        # Tests unitaires Vitest
```

## 📖 Guide de développement

### Création d'un nouveau composable

```typescript
// src/composables/useMonComposable.ts
import { ref, computed } from 'vue'

export function useMonComposable() {
  const state = ref(false)

  const toggleState = () => {
    state.value = !state.value
  }

  const statusMessage = computed(() => (state.value ? 'Activé' : 'Désactivé'))

  return {
    state,
    toggleState,
    statusMessage,
  }
}
```

### Ajout d'un nouveau lieu

```json
// src/data/data.json
{
  "id": "nouveau-lieu",
  "order": 14,
  "latitude": 48.79906,
  "longitude": 2.1234,
  "content": {
    "fr": {
      "title": "Nouveau Lieu",
      "description": "Description courte",
      "text": "Texte complet...",
      "audioFile": "nouveau-lieu-fr.mp3"
    },
    "en": {
      "title": "New Place",
      "description": "Short description",
      "text": "Full text...",
      "audioFile": "nouveau-lieu-en.mp3"
    }
  },
  "imageFile": "nouveau-lieu.jpg",
  "markerIcon": "fa-landmark"
}
```

### Stores Pinia

L'application utilise 3 stores principaux :

- **`useLanguageStore`** - Gestion multilingue
- **`useAudioStore`** - Contrôles audio et préchargement
- **`useGeolocationStore`** - Géolocalisation et permissions

```typescript
// Utilisation dans un composant
import { useAudioStore } from '@/stores/audio'

const audioStore = useAudioStore()
audioStore.playAudio('fichier.mp3')
```

## 🎨 Customisation du style

### Variables CSS

```css
/* src/styles/variables.css */
:root {
  --primary-color: #2e7d32;
  --secondary-color: #ffa726;
  --accent-color: #e57373;

  /* Responsive breakpoints */
  --mobile: 768px;
  --tablet: 1024px;
  --desktop: 1216px;
}
```

### Thème Bulma

Les composants utilisent les classes Bulma avec des variations personnalisées :

- `is-autumn-primary` - Couleur principale
- `is-autumn-success` - Couleur de succès
- `is-autumn-light` - Couleur claire

## 📱 PWA et performance

### Métriques de performance

```
Bundle size:     378.67 kB (gzip: 125.09 kB)
Lazy chunks:     AboutView (3.28 kB)
Build time:      ~3s
Lighthouse:      90+ score
```

### Optimisations incluses

- ✅ Code splitting automatique
- ✅ Lazy loading des routes
- ✅ Computed properties memoizés
- ✅ Préchargement audio intelligent
- ✅ Images optimisées et lazy loading

## ♿ Accessibilité

L'application respecte les standards **WCAG 2.1 AA** :

- Navigation complète au clavier
- Attributs ARIA appropriés
- Contrastes de couleur suffisants
- Support des lecteurs d'écran
- Focus visible et logique
- Textes alternatifs pour les images

## 🌐 Internationalisation

### Ajout d'une nouvelle langue

1. Créer le fichier de traduction :

```json
// src/locales/es.json
{
  "app": {
    "title": "Guía de Audio Abierta"
  }
}
```

2. Ajouter la langue à la configuration :

```typescript
// src/i18n/index.ts
import es from '@/locales/es.json'

const messages = { fr, en, es }
```

## 🚀 Déploiement

### Build de production

```bash
npm run build
# Les fichiers sont générés dans le dossier `dist/`
```

### Hébergement recommandé

- **Netlify** - Déploiement automatique depuis Git
- **Vercel** - Optimisé pour les applications Vue/Vite
- **GitHub Pages** - Hébergement gratuit pour projets open source

## 🤝 Contribution

### Workflow de contribution

1. **Fork** le repository
2. **Créer** une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commit** les changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. **Push** sur la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. **Créer** une Pull Request

### Standards de code

- **TypeScript strict** - Pas de `any`, interfaces complètes
- **ESLint** - Configuration standard Vue/TypeScript
- **Commits conventionnels** - `feat:`, `fix:`, `docs:`, etc.
- **Tests** - Couverture minimale 80% pour les nouveaux composables

## 📄 Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

- **Issues** : [GitHub Issues](https://github.com/Sylvaner/open-audio-guide/issues)
- **Documentation** : Consultez les rapports de phases dans `/docs/`
- **Discussions** : [GitHub Discussions](https://github.com/Sylvaner/open-audio-guide/discussions)

---

**Développé avec ❤️ par l'équipe Open Audio Guide**
