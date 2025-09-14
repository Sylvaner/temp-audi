<template>
  <div class="map-view">
    <LeafletMap
      ref="leafletMapRef"
      :center="mapCenter"
      :zoom="mapZoom"
      :user-position="geolocationStore.userPosition"
      :show-user-position="true"
      @map-ready="onMapReady"
      @map-click="onMapClick"
      @place-details="onPlaceDetails"
    />

    <!-- Contrôles de géolocalisation -->
    <div class="map-controls">
      <GeolocationButton
        size="normal"
        @request-permission="showGeolocationModal = true"
        @click="centerOnUser"
      />
      <AudioControls />
      <PlacesList @go-to-place="goToPlace" />
    </div>

    <!-- Modal de géolocalisation -->
    <GeolocationModal
      :is-visible="showGeolocationModal"
      :type="modalType"
      @close="showGeolocationModal = false"
      @allow="handleAllowGeolocation"
      @deny="handleDenyGeolocation"
      @retry="handleRetryGeolocation"
    />
  </div>

  <!-- Affichage plein écran pour le lieu sélectionné - Téléporté au niveau body -->
  <Teleport to="body">
    <div v-show="selectedPlace" class="place-fullscreen-view">
      <PlacePopup v-if="selectedPlace" :place="selectedPlace" @close="closePopup" />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, onMounted, onUnmounted } from 'vue'
import LeafletMap from '@/components/map/LeafletMap.vue'
import PlacesList from '@/components/map/PlacesList.vue'
import PlacePopup from '@/components/map/PlacePopup.vue'
import GeolocationButton from '@/components/ui/GeolocationButton.vue'
import GeolocationModal from '@/components/ui/GeolocationModal.vue'
import AudioControls from '@/components/ui/AudioControls.vue'
import { useGeolocationStore } from '@/stores/geolocation'
import { useMapGeolocation } from '@/composables/useMapGeolocation'
import { useMapPlaces } from '@/composables/useMapPlaces'
import type { Position } from '@/types'
import data from '@/data/data.json'

// Store
const geolocationStore = useGeolocationStore()

// État local de la carte
const mapCenter = ref<Position>({
  latitude: data.config.map.center.latitude,
  longitude: data.config.map.center.longitude,
})
const mapZoom = ref(data.config.map.zoom)
const mapInstance = ref<any>(null)
const leafletMapRef = ref<any>(null)

// Composables
const {
  showGeolocationModal,
  modalType,
  requestInitialGeolocation,
  centerOnUser,
  handleAllowGeolocation,
  handleDenyGeolocation,
  handleRetryGeolocation
} = useMapGeolocation(leafletMapRef)

const {
  selectedPlace,
  startAudioPreloading,
  onPlaceDetails,
  closePopup,
  goToPlace,
  onMapClick
} = useMapPlaces(leafletMapRef, data)

// Gestion des événements de carte
function onMapReady(map: any) {
  mapInstance.value = map
  console.log('Carte prête:', map)

  // Demander automatiquement la géolocalisation (délégué au composable)
  requestInitialGeolocation()

  // Démarrer le prétéléchargement des fichiers audio (délégué au composable)
  startAudioPreloading()
}

// Les watchers de géolocalisation et langue sont gérés dans les composables

// Gestionnaire pour fermer le popup avec Échap
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && selectedPlace.value) {
    closePopup()
  }
}

onMounted(() => {
  console.log('Vue carte montée')
  // Initialiser la géolocalisation si on a déjà la permission
  geolocationStore.initializeGeolocation()

  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  // Nettoyer l'événement lors du démontage
  document.removeEventListener('keydown', handleKeyDown)

  // Note: On ne stopWatching() pas ici pour que la géolocalisation
  // continue en arrière-plan même si on quitte la vue carte
})
</script>

<style scoped>
.map-view {
  height: 100%;
  width: 100%;
  position: relative;
}

/* Contrôles de carte positionnés en overlay */
.map-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: var(--z-ui);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-end;
}

/* Assure que la carte prend toute la hauteur disponible */
:deep(.leaflet-map) {
  height: calc(100vh - 3.25rem); /* Hauteur - navbar */
}

/* Ajustement pour mobile avec navbar fixe */
@media screen and (max-width: 1023px) {
  .map-view {
    position: fixed;
    top: 52px; /* Sous la navbar */
    left: 0;
    right: 0;
    bottom: 0;
    height: auto; /* Laisse la position gérer la hauteur */
  }

  :deep(.leaflet-map) {
    height: 100%;
    width: 100%;
  }

  .map-controls {
    top: 0.5rem;
    right: 0.5rem;
  }
}

/* Styles de l'affichage plein écran */
.place-fullscreen-view {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-modal);
  /* Pas de background ici car PlacePopup le gère */
}

/* Plus besoin des styles du modal */
</style>
