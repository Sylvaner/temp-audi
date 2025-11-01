<template>
  <div id="map" class="leaflet-map"></div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useLanguageStore } from '@/stores/language'
import { useAudioStore } from '@/stores/audio'
import { useConfig } from '@/composables/useConfig'
import { useLeafletMap } from '@/composables/useLeafletMap'
import { useMapMarkers } from '@/composables/useMapMarkers'
import data from '@/data/data.json'
import type { Place, Position } from '@/types'

// Props
interface Props {
  center?: Position
  zoom?: number
  userPosition?: Position | null
  showUserPosition?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  center: () => ({ latitude: 48.866667, longitude: 2.333333 }),
  zoom: 16,
  userPosition: null,
  showUserPosition: true,
})

// Événements émis
interface LeafletMapEmits {
  (e: 'mapClick', event: { latlng: { latitude: number; longitude: number } }): void
  (e: 'mapReady', map: L.Map): void
  (e: 'placeDetails', place: Place): void
}

const emit = defineEmits<LeafletMapEmits>()

// Composables
const languageStore = useLanguageStore()
const audioStore = useAudioStore()
const { markerStyle } = useConfig()
const currentLanguage = computed(() => languageStore.currentLocale)

// Données
const places = data.places as Place[]

// Utilisation des composables
const { mapInstance, initializeMap, cleanupMap, setView, centerOnUser } = useLeafletMap(props, emit)
const { createPlaceMarkers, updateUserPosition, cleanupMarkers } = useMapMarkers(
  mapInstance,
  places,
  currentLanguage.value,
  markerStyle.value,
  (event: 'placeDetails', place: Place) => emit(event, place),
)

// Watchers
watch(
  () => props.userPosition,
  (newPosition) => {
    updateUserPosition(newPosition)
  },
  { deep: true },
)

watch(currentLanguage, (newLanguage) => {
  // Recréer les marqueurs avec la nouvelle langue
  createPlaceMarkers()

  // Précharger les audios pour la nouvelle langue
  audioStore.startPreloadingForLanguage(places, newLanguage)
})

// Lifecycle hooks
onMounted(() => {
  initializeMap()

  // Créer les marqueurs des lieux avec un petit délai pour s'assurer que tout est prêt
  setTimeout(() => {
    createPlaceMarkers()
    if (props.userPosition) {
      updateUserPosition(props.userPosition)
    }

    // Démarrer le préchargement des audios pour la langue actuelle
    audioStore.startPreloadingForLanguage(places, currentLanguage.value)
  }, 100)
})

onUnmounted(() => {
  cleanupMarkers()
  cleanupMap()
})

// Exposition des méthodes
defineExpose({
  getMap: () => mapInstance.value,
  setView,
  centerOnUser: () => centerOnUser(props.userPosition),
})
</script>

<style scoped>
.leaflet-map {
  width: 100%;
  height: 100%;
  min-height: 400px;
  position: relative;
  z-index: var(--z-base);
}

/* Z-index pour éléments UI Leaflet */
:deep(.leaflet-control-container),
:deep(.leaflet-popup-pane),
:deep(.leaflet-tooltip-pane),
:deep(.leaflet-control),
:deep(.leaflet-marker-pane) {
  z-index: var(--z-ui) !important;
}

/* Z-index pour éléments de base Leaflet */
:deep(.leaflet-tile-pane),
:deep(.leaflet-overlay-pane) {
  z-index: var(--z-base) !important;
}

/* S'assurer que les panes généraux ne dépassent pas */
:deep(.leaflet-pane) {
  z-index: auto !important;
}

/* Styles communs pour tous les marqueurs */
:deep(.user-location-marker),
:deep(.place-marker) {
  background: transparent !important;
  border: none !important;
}

:deep(.user-location-icon),
:deep(.place-marker-icon) {
  position: relative;
  width: 40px;
  height: 40px;
}

/* Styles communs pour les cercles de marqueurs */
:deep(.user-location-circle),
:deep(.place-marker-circle) {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 36px;
  height: 36px;
  background: var(--color-primary);
  border: 3px solid white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: var(--shadow-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
  font-size: 16px;
  z-index: var(--z-ui);
}

/* Spécificités du marqueur utilisateur */
:deep(.user-location-circle) {
  animation: user-pulse 2s infinite;
}

/* Spécificités des marqueurs de lieux */
:deep(.place-marker-circle) {
  transition: all var(--transition-normal);
}

@keyframes user-pulse {
  0% {
    box-shadow:
      var(--shadow-medium),
      0 0 0 0 rgba(var(--color-primary-rgb), 0.5);
  }
  70% {
    box-shadow:
      var(--shadow-medium),
      0 0 0 10px rgba(var(--color-primary-rgb), 0);
  }
  100% {
    box-shadow:
      var(--shadow-medium),
      0 0 0 0 rgba(var(--color-primary-rgb), 0);
  }
}

:deep(.place-marker-circle.is-selected) {
  background: var(--color-warm);
  transform: translate(-50%, -50%) scale(1.1);
  z-index: var(--z-overlay);
}

:deep(.place-marker-circle:hover) {
  transform: translate(-50%, -50%) scale(1.1);
  box-shadow: var(--shadow-large);
}

/* Styles pour les popups */
:deep(.custom-popup .leaflet-popup-content-wrapper),
:deep(.custom-popup .leaflet-popup-tip) {
  background: var(--color-surface);
}

:deep(.custom-popup .leaflet-popup-content-wrapper) {
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-medium);
  padding: 0;
}

:deep(.custom-popup .leaflet-popup-content) {
  margin: 0;
  padding: 0;
}

.leaflet-attribution-flag {
  display: none !important;
}
</style>
