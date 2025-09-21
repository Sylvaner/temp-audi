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
          class="button is-rounded is-normal is-danger"
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
import { ref, onMounted, onUnmounted } from 'vue'
import LeafletMap from '@/components/map/LeafletMap.vue'
import PlacesList from '@/components/map/PlacesList.vue'
import PlacePopup from '@/components/map/PlacePopup.vue'
import GeolocationButton from '@/components/ui/GeolocationButton.vue'
import GeolocationModal from '@/components/ui/GeolocationModal.vue'
import { useGeolocationStore } from '@/stores/geolocation'
import { useAudioStore } from '@/stores/audio'
import { useMapGeolocation } from '@/composables/useMapGeolocation'
import { useMapPlaces } from '@/composables/useMapPlaces'
import type { Position } from '@/types'
import data from '@/data/data.json'

const geolocationStore = useGeolocationStore()
const audioStore = useAudioStore()
const mapCenter = ref<Position>({
  latitude: data.config.map.center.latitude,
  longitude: data.config.map.center.longitude,
})
const mapZoom = ref(data.config.map.zoom)
const mapInstance = ref<any>(null)
const leafletMapRef = ref<any>(null)

const {
  showGeolocationModal,
  modalType,
  requestInitialGeolocation,
  centerOnUser,
  handleAllowGeolocation,
  handleDenyGeolocation,
  handleRetryGeolocation,
} = useMapGeolocation(leafletMapRef)

const { selectedPlace, startAudioPreloading, onPlaceDetails, closePopup, goToPlace, onMapClick } =
  useMapPlaces(leafletMapRef, data)

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
</style>
