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

    <div class="map-controls">
      <GeolocationButton
        size="normal"
        @request-permission="showGeolocationModal = true"
        @click="centerOnUser"
      />

      <div v-if="audioStore.hasAudio" class="is-flex is-justify-content-center">
        <button
          class="button is-rounded is-normal is-danger stop-button"
          @click="audioStore.stopCurrent()"
          :disabled="audioStore.isLoading"
          :title="$t('audio.stop')"
        >
          <span class="icon">
            <i class="fas fa-stop"></i>
          </span>
        </button>
      </div>

      <PlacesList @go-to-place="goToPlace" />
    </div>

    <GeolocationModal
      :is-visible="showGeolocationModal"
      :type="modalType"
      @close="showGeolocationModal = false"
      @allow="handleAllowGeolocation"
      @deny="handleDenyGeolocation"
      @retry="handleRetryGeolocation"
    />
  </div>

  <Teleport to="body">
    <div v-show="selectedPlace" class="place-fullscreen-view">
      <PlacePopup v-if="selectedPlace" :place="selectedPlace" @close="closePopup" />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import LeafletMap from '@/components/map/LeafletMap.vue'
import PlacesList from '@/components/map/PlacesList.vue'
import PlacePopup from '@/components/map/PlacePopup.vue'
import GeolocationButton from '@/components/ui/GeolocationButton.vue'
import GeolocationModal from '@/components/ui/GeolocationModal.vue'
import { useGeolocationStore } from '@/stores/geolocation'
import { useAudioStore } from '@/stores/audio'
import { useLanguageStore } from '@/stores/language'
import type { Position, Place } from '@/types'
import data from '@/data/data.json'

const geolocationStore = useGeolocationStore()
const audioStore = useAudioStore()
const languageStore = useLanguageStore()

const mapCenter = ref<Position>({
  latitude: data.config.map.center.latitude,
  longitude: data.config.map.center.longitude,
})
const mapZoom = ref(data.config.map.zoom)
const mapInstance = ref<any>(null)
const leafletMapRef = ref<any>(null)

// ========================================
// Geolocation Modal Logic (ex-useMapGeolocation)
// ========================================
const showGeolocationModal = ref(false)
const hasRequestedGeolocation = ref(false)
const hasInitialCentering = ref(false)

const modalType = computed(() =>
  geolocationStore.permissionStatus === 'denied' ? 'denied' : 'request',
)

/**
 * Demande automatiquement la géolocalisation au chargement de la carte
 */
const requestInitialGeolocation = () => {
  if (geolocationStore.permissionStatus === 'unknown' && !hasRequestedGeolocation.value) {
    hasRequestedGeolocation.value = true
    setTimeout(() => {
      showGeolocationModal.value = true
    }, 1000)
  }
}

/**
 * Centre la carte sur la position utilisateur
 */
const centerOnUser = () => {
  if (leafletMapRef.value && geolocationStore.userPosition) {
    leafletMapRef.value.centerOnUser()
  }
}

/**
 * Centre sur l'utilisateur avec zoom augmenté
 */
const centerOnUserWithIncreasedZoom = () => {
  if (leafletMapRef.value && geolocationStore.userPosition) {
    leafletMapRef.value.setView(geolocationStore.userPosition, 18)
  }
}

/**
 * Gère l'autorisation de géolocalisation par l'utilisateur
 */
const handleAllowGeolocation = async () => {
  showGeolocationModal.value = false
  const success = await geolocationStore.requestPermission()

  if (success) {
    geolocationStore.startWatching()

    // Centrer seulement si c'est le premier lancement et qu'on a déjà une position
    if (!hasInitialCentering.value && geolocationStore.userPosition) {
      hasInitialCentering.value = true

      if (geolocationStore.shouldCenterOnUser) {
        centerOnUserWithIncreasedZoom()
      } else if (geolocationStore.moveToUserLocation) {
        centerOnUser()
      }
    }
  } else {
    // Afficher le modal d'erreur
    showGeolocationModal.value = true
  }
}

/**
 * Gère le refus de géolocalisation par l'utilisateur
 */
const handleDenyGeolocation = () => {
  showGeolocationModal.value = false
  // L'utilisateur a choisi de continuer sans géolocalisation
}

/**
 * Gère la tentative de réessai de géolocalisation
 */
const handleRetryGeolocation = async () => {
  const success = await geolocationStore.requestPermission()
  if (success) {
    geolocationStore.startWatching()
    showGeolocationModal.value = false
  }
  // Si échec, le modal reste ouvert pour permettre un autre essai
}

// ========================================
// Places Logic (ex-useMapPlaces)
// ========================================
const selectedPlace = ref<Place | null>(null)

/**
 * Démarre le prétéléchargement des fichiers audio
 */
const startAudioPreloading = () => {
  const currentLanguage = languageStore.currentLanguage?.code || 'fr'
  audioStore.startPreloadingForLanguage(data.places, currentLanguage)
}

/**
 * Gère le clic sur un lieu (marqueur)
 */
const onPlaceDetails = (place: Place) => {
  selectedPlace.value = place
  // Ne pas déclencher de zoom automatique lors du clic sur marker
}

/**
 * Ferme le popup de lieu
 */
const closePopup = () => {
  selectedPlace.value = null
}

/**
 * Navigue vers un lieu spécifique (zoom uniquement, sans ouvrir le popup)
 */
const goToPlace = (place: Place) => {
  if (leafletMapRef.value) {
    leafletMapRef.value.setView({ latitude: place.latitude, longitude: place.longitude }, 18)
    // Ne pas ouvrir le popup automatiquement, juste zoomer sur le lieu
  }
}

/**
 * Gère le clic général sur la carte
 */
const onMapClick = () => {
  // Fermer le popup si ouvert lors du clic sur la carte
  if (selectedPlace.value) {
    closePopup()
  }
}

// ========================================
// Map Ready & Lifecycle
// ========================================
function onMapReady(map: any) {
  mapInstance.value = map
  requestInitialGeolocation()
  startAudioPreloading()
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && selectedPlace.value) {
    closePopup()
  }
}

onMounted(() => {
  geolocationStore.initializeGeolocation()
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.map-view {
  height: 100%;
  width: 100%;
  position: relative;
}

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

:deep(.leaflet-map) {
  height: calc(100vh - 3.25rem);
}

@media screen and (max-width: 1023px) {
  .map-view {
    position: fixed;
    top: 52px;
    left: 0;
    right: 0;
    bottom: 0;
    height: auto;
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

.place-fullscreen-view {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-modal);
}

.stop-button {
  color: var(--color-white);
}
</style>
