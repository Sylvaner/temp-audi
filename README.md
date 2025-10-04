# 🎧 Open Audio Guide

A modern Vue.js web application for interactive multilingual audio guides with map navigation.

## Overview

Open Audio Guide is a Progressive Web App (PWA) designed for museums, tourist sites, and cultural institutions. It combines interactive maps, multilingual audio content, and an intuitive interface to create immersive visitor experiences.

### Key Features

- 🗺️ **Interactive Leaflet Maps** - Navigate with custom markers and geolocation
- 🎵 **Multilingual Audio Guides** - Support for multiple languages with synchronized playback
- 🛠️ **Visual Place Editor** - Edit places, coordinates, and content visually
- 📱 **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- 🌐 **i18n Support** - Easy internationalization with Vue I18n
- ⚡ **Optimized Performance** - Built with Vite for fast loading and rendering

### Tech Stack

- **Frontend**: Vue 3 (Composition API) + TypeScript
- **State Management**: Pinia stores
- **Styling**: Bulma CSS + FontAwesome icons
- **Maps**: Leaflet + OpenStreetMap
- **Build Tool**: Vite
- **Testing**: Vitest

---

## Installation

### Prerequisites

- Node.js 18+ or Yarn
- npm 9+ or Yarn 1.22+

### Setup

```bash
# Clone the repository
git clone https://github.com/Sylvaner/temp-audi.git
cd temp-audi

# Install dependencies
npm install
# or
yarn install
```

---

## Configuration

### Visual Place Editor (Recommended)

The easiest way to configure places is using the **Visual Place Editor**. You don't need to understand the JSON structure - just use the visual interface.

```bash
# Launch the visual editor
npm run edit
# or
yarn edit
```

The editor opens at [http://localhost:3001](http://localhost:3001) (or next available port).

#### Editor Interface

**Left Panel - Places List:**
- View all places in order
- Click a place to select and edit it
- Use ↑↓ buttons to reorder places
- 🎯 Center map on place
- 📋 Duplicate place
- 🗑️ Delete place

**Right Panel - Place Editor:**
- **ID**: Unique identifier for the place
- **Latitude/Longitude**: Coordinates (also editable by dragging marker on map)
- **Color**: Custom marker color (defaults to config color if not set)
- **Icon**: FontAwesome icon name (e.g., `fa-monument`, `fa-tower-observation`)
- **Image file**: Image filename from `public/images/`
- **Content per language**:
  - Title
  - Description (short text for list view)
  - Full text (detailed guide content)
  - Audio file (filename from `public/audio/`)

**Top Controls:**
- **Load**: Reload data from `src/data/data.json`
- **Save**: Save changes directly to file (auto-saves to disk)
- **Config**: Edit global map and marker settings

**Map Interaction:**
- Click on map to select a place
- Drag markers to change coordinates
- Selection is highlighted with a red pulsing circle

**Quick Start:**
1. Launch the editor with `yarn edit`
2. Click on the map or use the places list
3. Fill in the details for each language
4. Click "Save" - changes are written to `src/data/data.json`
5. Refresh your main app to see changes

For advanced users who prefer manual editing, see the detailed JSON structure below.

### Manual Configuration (data.json)

All places are defined in `src/data/data.json`. This file contains:

1. **Global configuration** (`config` object)
2. **Places array** with location data and multilingual content

#### Basic Structure

```json
{
  "config": {
    "defaultLanguage": "en",
    "map": {
      "center": { "latitude": 47.6205, "longitude": 1.3312 },
      "zoom": 13
    },
    "markers": {
      "defaultColor": "#8B4513",
      "place": "fa-monument",
      "userLocation": "fa-person-walking"
    }
  },
  "places": [
    {
      "id": "main-tower",
      "latitude": 47.6205,
      "longitude": 1.3312,
      "content": {
        "en": {
          "title": "Main Tower",
          "description": "Central defensive tower",
          "text": "Built in 1180, this imposing tower served as the castle's main defense...",
          "audioFile": "main-tower-en.mp3"
        },
        "fr": {
          "title": "Tour Principale",
          "description": "Tour défensive centrale",
          "text": "Construite en 1180, cette imposante tour servait de défense principale...",
          "audioFile": "main-tower-fr.mp3"
        }
      },
      "imageFile": "main-tower.jpg",
      "markerColor": "#8B0000",
      "markerIcon": "fa-tower-observation"
    }
  ]
}
```

#### Field Descriptions

**Place Fields:**
- `id` (required): Unique identifier (lowercase, no spaces)
- `latitude` (required): GPS latitude coordinate
- `longitude` (required): GPS longitude coordinate
- `content` (required): Object with language codes as keys
  - `title`: Place name
  - `description`: Short description (shown in list)
  - `text`: Full guide text
  - `audioFile`: Audio filename (stored in `public/audio/`)
- `imageFile` (optional): Image filename (stored in `public/images/`)
- `markerColor` (optional): Custom marker color (hex code)
- `markerIcon` (optional): FontAwesome icon class

**Config Fields:**
- `defaultLanguage`: Initial language on app load
- `map.center`: Default map center coordinates
- `map.zoom`: Default zoom level (1-20)
- `markers.defaultColor`: Default marker color for all places
- `markers.place`: Default icon for place markers
- `markers.userLocation`: Icon for user location marker

---

## Usage

### Development Mode

```bash
# Start development server
npm run dev
# or
yarn dev
```

Visit [http://localhost:5173](http://localhost:5173)

---

## Customization

### Modifying Views

#### Home Page

Edit `src/views/HomeView.vue` to customize the home page content and layout.

```vue
<template>
  <div class="home">
    <h1>Welcome to Audio Guide</h1>
    <!-- Add your custom content -->
  </div>
</template>

<script setup lang="ts">
// Add your logic
</script>
```

#### About Page

Edit `src/views/AboutView.vue` for the about page.

```vue
<template>
  <div class="about">
    <h1>About Us</h1>
    <p>Your institution description...</p>
  </div>
</template>
```

### Adding New Routes

1. **Create a new view component** in `src/views/`:

```vue
<!-- src/views/ContactView.vue -->
<template>
  <div class="contact">
    <h1>Contact Us</h1>
  </div>
</template>

<script setup lang="ts">
// Component logic
</script>
```

2. **Register the route** in `src/router/index.ts`:

```typescript
import ContactView from '@/views/ContactView.vue'

const router = createRouter({
  routes: [
    // ...existing routes
    {
      path: '/contact',
      name: 'contact',
      component: ContactView
    }
  ]
})
```

3. **Add navigation link** in your navigation component or layout.

### Adding Languages

#### 1. Create Translation File

Create a new file in `src/locales/`:

```json
// src/locales/es.json
{
  "app": {
    "title": "Guía de Audio",
    "subtitle": "Descubre lugares increíbles"
  },
  "nav": {
    "home": "Inicio",
    "about": "Acerca de",
    "map": "Mapa"
  },
  "places": {
    "list": "Lugares",
    "details": "Detalles"
  }
}
```

#### 2. Import in i18n Config

Edit `src/i18n/index.ts`:

```typescript
import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import fr from '@/locales/fr.json'
import de from '@/locales/de.json'
import es from '@/locales/es.json' // Add import

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    fr,
    de,
    es // Add to messages
  }
})

export default i18n
```

#### 3. Add Place Content

In `src/data/data.json`, add translations for each place:

```json
{
  "places": [
    {
      "id": "throne-room",
      "latitude": 47.6205,
      "longitude": 1.3312,
      "content": {
        "en": {
          "title": "Throne Room",
          "description": "Royal ceremonial hall",
          "text": "The Throne Room was the heart of royal power in the castle...",
          "audioFile": "throne-room-en.mp3"
        },
        "fr": {
          "title": "Salle du Trône",
          "description": "Salle cérémonielle royale",
          "text": "La Salle du Trône était le cœur du pouvoir royal au château...",
          "audioFile": "throne-room-fr.mp3"
        },
        "es": {
          "title": "Sala del Trono",
          "description": "Sala ceremonial real",
          "text": "La Sala del Trono era el corazón del poder real en el castillo...",
          "audioFile": "throne-room-es.mp3"
        }
      }
    }
  ]
}
```

#### 4. Add Language Selector

The language selector automatically detects available languages from your i18n config.

---

## Build & Deployment

### Production Build

```bash
# Create optimized production build
npm run build
# or
yarn build
```

Build output is generated in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

### Deployment Options

#### Static Hosting (Netlify, Vercel, GitHub Pages)

1. Build the project: `npm run build`
2. Deploy the `dist/` folder
3. Configure routing for SPA:
   - Netlify: Create `public/_redirects` with `/* /index.html 200`
   - Vercel: Automatically handled
   - GitHub Pages: Use `vue-router` hash mode

#### Docker

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build and run:**

```bash
# Build Docker image
docker build -t open-audio-guide .

# Run container
docker run -d -p 8080:80 open-audio-guide
```

Visit [http://localhost:8080](http://localhost:8080)

---

## Project Structure

```
open-audio-guide/
├── public/                    # Static assets
│   ├── audio/                # Audio files (*.mp3)
│   ├── images/               # Place images (*.jpg, *.png)
│   └── favicon.ico
├── src/
│   ├── components/           # Vue components
│   │   ├── map/             # Map-related components
│   │   ├── navigation/      # Navigation components
│   │   └── ui/              # Reusable UI components
│   ├── composables/         # Composition API functions
│   │   ├── useAudioEventHandlers.ts
│   │   ├── useGeolocation.ts
│   │   └── useLeafletMap.ts
│   ├── data/
│   │   └── data.json        # **Main data file**
│   ├── i18n/                # Internationalization
│   │   └── index.ts
│   ├── locales/             # Translation files
│   │   ├── en.json
│   │   ├── fr.json
│   │   └── de.json
│   ├── router/              # Vue Router config
│   │   └── index.ts
│   ├── stores/              # Pinia stores
│   │   ├── audio.ts
│   │   ├── geolocation.ts
│   │   └── language.ts
│   ├── styles/              # Global styles
│   │   ├── global.css
│   │   └── variables.css
│   ├── types/               # TypeScript definitions
│   │   ├── common.ts
│   │   ├── data.ts
│   │   └── geolocation.ts
│   ├── views/               # Page components
│   │   ├── HomeView.vue
│   │   └── AboutView.vue
│   ├── App.vue              # Root component
│   └── main.ts              # App entry point
├── tools/                    # Development tools
│   ├── Editor.vue           # Visual place editor
│   ├── vite.config.js       # Editor Vite config
│   └── index-vue.html       # Editor HTML entry
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Data Structure (data.json)

### Complete Example

```json
{
  "config": {
    "defaultLanguage": "en",
    "map": {
      "center": {
        "latitude": 47.6205,
        "longitude": 1.3312
      },
      "zoom": 15
    },
    "markers": {
      "defaultColor": "#8B4513",
      "place": "fa-monument",
      "userLocation": "fa-person-walking"
    }
  },
  "places": [
    {
      "id": "knights-hall",
      "latitude": 47.6205,
      "longitude": 1.3312,
      "content": {
        "en": {
          "title": "Knights' Hall",
          "description": "Medieval banquet hall",
          "text": "The Knights' Hall was built in the 13th century and served as the main gathering place...",
          "audioFile": "knights-hall-en.mp3"
        },
        "fr": {
          "title": "Salle des Chevaliers",
          "description": "Salle de banquet médiévale",
          "text": "La Salle des Chevaliers fut construite au 13ème siècle et servait de lieu de rassemblement principal...",
          "audioFile": "knights-hall-fr.mp3"
        }
      },
      "imageFile": "knights-hall.jpg",
      "markerColor": "#8B4513",
      "markerIcon": "fa-chess-rook"
    }
  ]
}
```

### Field Reference

#### Config Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `defaultLanguage` | string | Yes | Initial language code (e.g., "en", "fr") |
| `map.center.latitude` | number | Yes | Default map center latitude |
| `map.center.longitude` | number | Yes | Default map center longitude |
| `map.zoom` | number | Yes | Default zoom level (1-20) |
| `markers.defaultColor` | string | Yes | Default marker color (hex code) |
| `markers.place` | string | Yes | Default place marker icon |
| `markers.userLocation` | string | Yes | User location marker icon |

#### Place Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (lowercase, hyphens) |
| `latitude` | number | Yes | GPS latitude (-90 to 90) |
| `longitude` | number | Yes | GPS longitude (-180 to 180) |
| `content` | object | Yes | Multilingual content object |
| `content.{lang}.title` | string | Yes | Place title |
| `content.{lang}.description` | string | Yes | Short description (list view) |
| `content.{lang}.text` | string | Yes | Full guide text |
| `content.{lang}.audioFile` | string | Yes | Audio filename (in `public/audio/`) |
| `imageFile` | string | No | Image filename (in `public/images/`) |
| `markerColor` | string | No | Custom marker color (defaults to config) |
| `markerIcon` | string | No | FontAwesome icon (defaults to config) |

---

## How It Works

### Application Flow

1. **App Initialization** (`main.ts`)
   - Loads Vue app with Pinia, Router, and i18n
   - Fetches `data.json` and initializes stores

2. **Home Page** (`HomeView.vue`)
   - Displays welcome content
   - Provides navigation to map and other views

3. **Map View**
   - Initializes Leaflet map with configured center/zoom
   - Loads places from data store
   - Creates custom markers for each place
   - Handles user geolocation
   - Displays place details on marker click

4. **Audio Playback**
   - Audio store manages playback state
   - Preloads audio files for better UX
   - Syncs audio with selected place

5. **Language Switching**
   - Language store manages current locale
   - i18n updates UI translations
   - Place content updates based on selected language

### Data Flow

```
data.json → Pinia Store → Vue Components → UI
                ↓
           Composables
           (useLeafletMap, useAudioEventHandlers, etc.)
                ↓
           Leaflet Map + Audio Player
```

### Key Composables

- **useLeafletMap**: Initializes and manages Leaflet map instance
- **useMapMarkers**: Creates and updates place markers
- **useAudioEventHandlers**: Handles audio play/pause/stop events
- **useGeolocation**: Manages user location tracking
- **useConfig**: Provides access to app configuration

### Stores

- **languageStore**: Current language, available languages
- **audioStore**: Current audio, playing state, preloaded files
- **geolocationStore**: User position, tracking state, permissions

---

## License

MIT License

---

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/Sylvaner/temp-audi).
