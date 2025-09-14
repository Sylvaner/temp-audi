<template>
  <div id="map" class="leaflet-map"></div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { onMounted, onUnmounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Position } from '@/types'
import { useLanguageStore } from '@/stores/language'
import { useConfig } from '@/composables/useConfig'
import data from '@/data/data.json'

// Types locaux
interface Place {
  id: string
  latitude: number
  longitude: number
  imageFile?: string
  markerColor?: string
  markerIcon?: string
  content: Record<
    string,
    {
      title: string
      description: string
      text: string
      audioFile: string
    }
  >
}

// Extension du type Marker de Leaflet pour inclure placeId
interface ExtendedMarker extends L.Marker {
  placeId?: string
}

// Props
interface Props {
  center?: Position
  zoom?: number
  userPosition?: Position | null
  showUserPosition?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  center: () => ({ latitude: 48.79804431250326, longitude: 2.120114373979427 }),
  zoom: 16,
  userPosition: null,
  showUserPosition: true,
})

// Composables
const languageStore = useLanguageStore()
const { markerStyle } = useConfig()

// État local
const mapInstance = ref<any>(null)
const userMarker = ref<any>(null)
const userAccuracyCircle = ref<any>(null)
const placeMarkers = ref<any[]>([]) // Garder any[] pour la compatibilité Leaflet
const activeMarkerId = ref<string | null>(null) // Pour tracker le marqueur actif

// Données
const places = data.places as Place[]

// Émissions
const emit = defineEmits<{
  mapReady: [map: any]
  mapClick: [event: any]
  placeDetails: [place: Place]
}>()

// Fonction pour créer l'icône des lieux
const createPlaceIcon = (place: Place, isActive = false) => {
  // Couleur : utiliser la couleur personnalisée ou les couleurs par défaut
  const color = isActive ? 'var(--color-warm)' : place.markerColor || markerStyle.value.defaultColor

  // Icône : utiliser l'icône personnalisée ou l'icône par défaut configurée
  const iconClass = place.markerIcon || markerStyle.value.defaultPlaceIcon

  return L.divIcon({
    className: 'place-marker',
    html: `
      <div class="place-marker-icon">
        <div class="place-marker-circle" style="background-color: ${color};">
          <i class="fas ${iconClass}"></i>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })
}

// Fonction pour créer les marqueurs des lieux
const createPlaceMarkers = () => {
  if (!mapInstance.value) return

  // Supprimer les marqueurs existants
  placeMarkers.value.forEach((marker) => {
    mapInstance.value.removeLayer(marker)
  })
  placeMarkers.value = []

  // Créer les nouveaux marqueurs
  places.forEach((place) => {
    const isActive = activeMarkerId.value === place.id

    const marker = L.marker([place.latitude, place.longitude], {
      icon: createPlaceIcon(place, isActive),
      zIndexOffset: 500, // Au-dessus de la carte mais sous le marqueur utilisateur
    }) as ExtendedMarker

    // Stocker l'ID du lieu sur le marqueur pour référence
    marker.placeId = place.id

    // Événement de clic pour ouvrir le modal
    marker.on('click', () => {
      emit('placeDetails', place)
      // Mettre à jour l'icône pour montrer l'état actif
      if (activeMarkerId.value !== place.id) {
        // Réinitialiser l'ancien marqueur actif
        if (activeMarkerId.value) {
          const oldPlace = places.find((p) => p.id === activeMarkerId.value)
          const oldMarker = placeMarkers.value.find((m) => m.placeId === activeMarkerId.value)
          if (oldMarker && oldPlace) {
            oldMarker.setIcon(createPlaceIcon(oldPlace, false))
          }
        }
        activeMarkerId.value = place.id
        marker.setIcon(createPlaceIcon(place, true))
      }
    })

    marker.addTo(mapInstance.value)
    placeMarkers.value.push(marker)
  })
}

// Fonction pour créer l'icône de l'utilisateur
const createUserIcon = () => {
  const userColor =
    markerStyle.value.defaultUserLocationColor || getCSSVariable('--color-user') || '#007bff'
  return L.divIcon({
    className: 'user-location-marker',
    html: `
      <div class="user-location-icon">
        <div class="user-location-circle" style="background-color: ${userColor};">
          <i class="fas ${markerStyle.value.defaultUserLocationIcon}"></i>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })
}

// Fonction pour mettre à jour la position de l'utilisateur
// Obtenir les couleurs depuis les variables CSS
function getCSSVariable(variableName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim()
}

function updateUserPosition(position: Position) {
  if (!mapInstance.value) return

  const latLng = L.latLng(position.latitude, position.longitude)

  // Supprimer les anciens marqueurs/cercles utilisateur
  if (userMarker.value) {
    mapInstance.value.removeLayer(userMarker.value)
  }
  if (userAccuracyCircle.value) {
    mapInstance.value.removeLayer(userAccuracyCircle.value)
  }

  const primaryColor = getCSSVariable('--color-primary')

  // Ajouter le cercle de précision (rayon approximatif de 10m)
  userAccuracyCircle.value = L.circle(latLng, {
    radius: 10,
    fillColor: primaryColor,
    fillOpacity: 0.1,
    color: primaryColor,
    weight: 1,
    opacity: 0.3,
  }).addTo(mapInstance.value)

  // Ajouter le marqueur de l'utilisateur
  userMarker.value = L.marker(latLng, {
    icon: createUserIcon(),
    zIndexOffset: 1000, // Assurer que le marqueur utilisateur est au-dessus
  }).addTo(mapInstance.value)
}

// Watcher pour surveiller les changements de position utilisateur
watch(
  () => props.userPosition,
  (newPosition) => {
    if (newPosition) {
      updateUserPosition(newPosition)
    }
  },
  { immediate: true },
)

// Watcher pour mettre à jour les marqueurs quand la langue change
watch(
  () => languageStore.currentLanguage?.code,
  () => {
    if (mapInstance.value && placeMarkers.value.length > 0) {
      // Recréer les marqueurs pour mettre à jour le contenu dans la nouvelle langue
      createPlaceMarkers()
    }
  },
)

onMounted(() => {
  // Création de la carte
  mapInstance.value = L.map('map').setView(
    [props.center.latitude, props.center.longitude],
    props.zoom,
  )

  // Ajout des tuiles OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(mapInstance.value)

  // Créer les marqueurs des lieux avec un petit délai pour s'assurer que tout est prêt
  setTimeout(() => {
    createPlaceMarkers()
  }, 100)

  // Événements
  mapInstance.value.on('click', (e: any) => {
    emit('mapClick', e)
  })

  // Émission map ready
  emit('mapReady', mapInstance.value)
})

onUnmounted(() => {
  // Nettoyer les marqueurs utilisateur
  if (userMarker.value && mapInstance.value) {
    mapInstance.value.removeLayer(userMarker.value)
  }
  if (userAccuracyCircle.value && mapInstance.value) {
    mapInstance.value.removeLayer(userAccuracyCircle.value)
  }

  // Nettoyer les marqueurs de lieux
  placeMarkers.value.forEach((marker: any) => {
    if (mapInstance.value) {
      mapInstance.value.removeLayer(marker)
    }
  })

  // Supprimer la carte
  if (mapInstance.value) {
    mapInstance.value.remove()
  }
})

// Exposition des méthodes
defineExpose({
  getMap: () => mapInstance.value,
  setView: (center: Position, zoom?: number) => {
    if (mapInstance.value) {
      mapInstance.value.setView([center.latitude, center.longitude], zoom)
    }
  },
  centerOnUser: () => {
    if (mapInstance.value && props.userPosition) {
      mapInstance.value.setView([props.userPosition.latitude, props.userPosition.longitude], 18)
    }
  },
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

/* Override des z-index Leaflet pour respecter notre hiérarchie */
:deep(.leaflet-control-container) {
  z-index: var(--z-ui) !important;
}

:deep(.leaflet-popup-pane) {
  z-index: var(--z-ui) !important;
}

:deep(.leaflet-tooltip-pane) {
  z-index: var(--z-ui) !important;
}

/* S'assurer que tous les éléments Leaflet de base restent sous les contrôles */
:deep(.leaflet-tile-pane),
:deep(.leaflet-overlay-pane) {
  z-index: var(--z-base) !important;
}

/* Les contrôles Leaflet (zoom, etc.) au niveau UI */
:deep(.leaflet-control),
:deep(.leaflet-marker-pane) {
  z-index: var(--z-ui) !important;
}

/* S'assurer que les panes généraux ne dépassent pas */
:deep(.leaflet-pane) {
  z-index: auto !important;
}

/* Styles pour le marqueur de localisation utilisateur */
:deep(.user-location-marker) {
  background: transparent !important;
  border: none !important;
}

:deep(.user-location-icon) {
  position: relative;
  width: 40px;
  height: 40px;
}

:deep(.user-location-circle) {
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
  animation: user-pulse 2s infinite;
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

/* Styles pour les marqueurs de lieux */
:deep(.place-marker) {
  background: transparent !important;
  border: none !important;
}

:deep(.place-marker-icon) {
  position: relative;
  width: 40px;
  height: 40px;
}

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
  transition: all var(--transition-normal);
  z-index: var(--z-ui);
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
:deep(.custom-popup .leaflet-popup-content-wrapper) {
  background: var(--color-surface);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-medium);
  padding: 0;
}

:deep(.custom-popup .leaflet-popup-content) {
  margin: 0;
  padding: 0;
}

:deep(.custom-popup .leaflet-popup-tip) {
  background: var(--color-surface);
}

/* Contrôles de la carte */
:deep(.leaflet-control-container) {
  z-index: var(--z-ui);
}

.leaflet-attribution-flag {
  display: none !important;
}
</style>
