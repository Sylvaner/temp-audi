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
      <PlacesList @go-to-place="goToPlace" />
      <GeolocationButton
        size="normal"
        @request-permission="showGeolocationModal = true"
        @click="centerOnUser"
      />
      <AudioControls />
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

    <!-- Affichage plein écran pour le lieu sélectionné -->
    <div v-if="selectedPlace" class="place-fullscreen-view">
      <PlacePopup :place="selectedPlace" @close="closePopup" />
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import LeafletMap from '@/components/map/LeafletMap.vue'
import PlacesList from '@/components/map/PlacesList.vue'
import PlacePopup from '@/components/map/PlacePopup.vue'
import GeolocationButton from '@/components/ui/GeolocationButton.vue'
import GeolocationModal from '@/components/ui/GeolocationModal.vue'
import AudioControls from '@/components/ui/AudioControls.vue'
import { useGeolocationStore } from '@/stores/geolocation'
import { useAudioStore } from '@/stores/audio'
import { useLanguageStore } from '@/stores/language'
import type { Position } from '@/types'
import data from '@/data/data.json'

// Stores
const geolocationStore = useGeolocationStore()
const audioStore = useAudioStore()
const languageStore = useLanguageStore()

// État local
const mapCenter = ref<Position>({
  latitude: data.config.map.center.latitude,
  longitude: data.config.map.center.longitude,
})
const mapZoom = ref(data.config.map.zoom)
const mapInstance = ref<any>(null)
const leafletMapRef = ref<any>(null)
const showGeolocationModal = ref(false)
const hasRequestedGeolocation = ref(false) // Flag pour éviter de redemander
const selectedPlace = ref<any>(null) // Place sélectionnée pour le popup modal
const hasInitialCentering = ref(false) // Flag pour ne centrer qu'au premier lancement

// Computed
const modalType = computed(() =>
  geolocationStore.permissionStatus === 'denied' ? 'denied' : 'request',
)

// Gestion des événements de carte
function onMapReady(map: any) {
  mapInstance.value = map
  console.log('Carte prête:', map)

  // Demander automatiquement la géolocalisation au chargement seulement si pas encore demandée
  if (geolocationStore.permissionStatus === 'unknown' && !hasRequestedGeolocation.value) {
    hasRequestedGeolocation.value = true
    setTimeout(() => {
      showGeolocationModal.value = true
    }, 1000) // Délai pour laisser la carte se charger
  }

  // Démarrer le prétéléchargement des fichiers audio
  startAudioPreloading()
}

// Fonction pour démarrer le prétéléchargement
function startAudioPreloading() {
  const currentLanguage = languageStore.currentLanguage?.code || 'fr'

  // Prétélécharger uniquement la langue sélectionnée
  audioStore.startPreloadingForLanguage(data.places, currentLanguage)
}

function onMapClick(event: any) {
  console.log('Clic sur la carte:', event.latlng)
}

function onPlaceDetails(place: any) {
  console.log('Détails du lieu demandés:', place)
  selectedPlace.value = place
  // Ne pas déclencher de zoom automatique lors du clic sur marker
}

function closePopup() {
  selectedPlace.value = null
}

// Gestion de la géolocalisation
async function handleAllowGeolocation() {
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

      console.log('Centrage initial effectué après acceptation de la géolocalisation')
    }
  } else {
    // Afficher le modal d'erreur
    showGeolocationModal.value = true
  }
}

function handleDenyGeolocation() {
  showGeolocationModal.value = false
  // L'utilisateur a choisi de continuer sans géolocalisation
}

async function handleRetryGeolocation() {
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

      console.log('Centrage initial effectué après retry de la géolocalisation')
    }
  } else {
    // Réafficher le modal si échec
    setTimeout(() => {
      showGeolocationModal.value = true
    }, 500)
  }
}

function centerOnUser() {
  if (geolocationStore.userPosition && leafletMapRef.value) {
    leafletMapRef.value.centerOnUser()
  }
}

function centerOnUserWithIncreasedZoom() {
  if (geolocationStore.userPosition && leafletMapRef.value) {
    // Centrer avec le zoom configuré dans goToInitialUserLocation.increaseZoom
    const increasedZoom = geolocationStore.getIncreasedZoom
    leafletMapRef.value.setView(geolocationStore.userPosition, increasedZoom)
  }
}

function goToPlace(position: Position) {
  if (leafletMapRef.value) {
    leafletMapRef.value.setView(position, 18)
  }
}

// Watcher pour centrer automatiquement seulement au premier lancement
watch(
  () => geolocationStore.userPosition,
  (newPosition) => {
    if (newPosition && mapInstance.value) {
      // Centrer seulement au premier lancement
      if (!hasInitialCentering.value) {
        hasInitialCentering.value = true

        // Vérifier si on doit centrer automatiquement selon la configuration
        if (geolocationStore.shouldCenterOnUser) {
          centerOnUserWithIncreasedZoom()
        } else if (geolocationStore.moveToUserLocation) {
          // Première fois qu'on obtient la position
          centerOnUser()
        }

        console.log('Centrage initial effectué sur la position utilisateur')
      } else {
        // Les mises à jour suivantes n'entraînent pas de centrage
        console.log('Position utilisateur mise à jour (pas de centrage automatique)')
      }
    }
  },
)

// Watcher pour relancer le prétéléchargement lors du changement de langue
watch(
  () => languageStore.currentLanguage?.code,
  (newLanguage) => {
    if (newLanguage) {
      console.log('Changement de langue détecté, relance du prétéléchargement:', newLanguage)
      startAudioPreloading()
    }
  },
)

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
  z-index: var(--z-map-ui-controls);
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
