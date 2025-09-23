import { ref, type Ref } from 'vue'
import L from 'leaflet'
import type { Position, Place } from '@/types'

// Types simplifiés pour LeafletMap
type Props = {
  center?: Position
  zoom?: number
  userPosition?: Position | null
  showUserPosition?: boolean
}

type LeafletMapEmits = {
  (e: 'mapClick', event: { latlng: { latitude: number; longitude: number } }): void
  (e: 'mapReady', map: L.Map): void
  (e: 'placeDetails', place: Place): void
}

export function useLeafletMap(props: Props, emit: LeafletMapEmits) {
  const mapInstance: Ref<L.Map | null> = ref(null)

  const initializeMap = () => {
    // Vérifier si la carte n'est pas déjà initialisée
    if (mapInstance.value) {
      return
    }

    // Création de la carte
    mapInstance.value = L.map('map').setView(
      [props.center!.latitude, props.center!.longitude],
      props.zoom,
    )

    // Ajout des tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapInstance.value)

    // Événements
    mapInstance.value.on('click', (e: L.LeafletMouseEvent) => {
      emit('mapClick', {
        latlng: {
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        },
      })
    })

    // Émission map ready
    emit('mapReady', mapInstance.value)
  }

  const cleanupMap = () => {
    if (mapInstance.value) {
      mapInstance.value.remove()
      mapInstance.value = null
    }
  }

  const setView = (center: Position, zoom?: number) => {
    if (mapInstance.value) {
      mapInstance.value.setView([center.latitude, center.longitude], zoom)
    }
  }

  const centerOnUser = (userPosition?: Position | null) => {
    if (mapInstance.value && userPosition) {
      mapInstance.value.setView([userPosition.latitude, userPosition.longitude], 18)
    }
  }

  return {
    mapInstance,
    initializeMap,
    cleanupMap,
    setView,
    centerOnUser,
  }
}
