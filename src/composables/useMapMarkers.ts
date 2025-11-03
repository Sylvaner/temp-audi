import { ref, type Ref } from 'vue'
import L from 'leaflet'
import type { Place, Position } from '@/types'
import { getFontAwesomeSVG } from '@/utils/fontawesome-helper'

// Types simplifiés
type ExtendedMarker = L.Marker & {
  placeId?: string
}

type MarkerStyle = {
  defaultColor: string
  defaultPlaceIcon: string
  defaultUserLocationColor: string
  defaultUserLocationIcon: string
}

export function useMapMarkers(
  mapInstance: Ref<L.Map | null>,
  places: Place[],
  currentLanguage: string,
  markerStyle: MarkerStyle,
  onPlaceClick: (event: 'placeDetails', place: Place) => void,
) {
  const placeMarkers: Ref<ExtendedMarker[]> = ref([])
  const userMarker: Ref<L.Marker | null> = ref(null)
  const userAccuracyCircle: Ref<L.Circle | null> = ref(null)
  const activeMarkerId: Ref<string | null> = ref(null)

  // Obtenir les couleurs depuis les variables CSS
  function getCSSVariable(variableName: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim()
  }

  // Fonction pour créer l'icône des lieux
  const createPlaceIcon = (place: Place, isActive = false) => {
    const color = isActive ? 'var(--color-warm)' : place.markerColor || markerStyle.defaultColor
    const iconClass = place.markerIcon || markerStyle.defaultPlaceIcon
    const iconSVG = getFontAwesomeSVG(iconClass)

    return L.divIcon({
      className: 'place-marker',
      html: `
        <div class="place-marker-icon">
          <div class="place-marker-circle" style="background-color: ${color};">
            ${iconSVG}
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    })
  }

  // Fonction pour créer l'icône de l'utilisateur
  const createUserIcon = () => {
    const userColor =
      markerStyle.defaultUserLocationColor || getCSSVariable('--color-user') || '#007bff'
    const iconSVG = getFontAwesomeSVG(markerStyle.defaultUserLocationIcon)

    return L.divIcon({
      className: 'user-location-marker',
      html: `
        <div class="user-location-icon">
          <div class="user-location-circle" style="background-color: ${userColor};">
            ${iconSVG}
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
      if (mapInstance.value) {
        mapInstance.value.removeLayer(marker)
      }
    })
    placeMarkers.value = []

    // Créer les nouveaux marqueurs
    places.forEach((place) => {
      const isActive = activeMarkerId.value === place.id

      const marker = L.marker([place.latitude, place.longitude], {
        icon: createPlaceIcon(place, isActive),
        zIndexOffset: 500,
      }) as ExtendedMarker

      marker.placeId = place.id

      // Événement de clic pour ouvrir le modal
      marker.on('click', () => {
        onPlaceClick('placeDetails', place)

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

      if (mapInstance.value) {
        marker.addTo(mapInstance.value)
      }
      placeMarkers.value.push(marker)
    })
  }

  // Fonction pour mettre à jour la position de l'utilisateur
  const updateUserPosition = (position: Position | null) => {
    if (!mapInstance.value || !position) return

    // Supprimer l'ancien marqueur s'il existe
    if (userMarker.value) {
      mapInstance.value.removeLayer(userMarker.value)
      userMarker.value = null
    }

    // Supprimer l'ancien cercle de précision s'il existe
    if (userAccuracyCircle.value) {
      mapInstance.value.removeLayer(userAccuracyCircle.value)
      userAccuracyCircle.value = null
    }

    // Créer le nouveau marqueur utilisateur
    userMarker.value = L.marker([position.latitude, position.longitude], {
      icon: createUserIcon(),
      zIndexOffset: 1000, // Au-dessus de tous les autres marqueurs
    }).addTo(mapInstance.value)

    // Pour le moment, on ne gère pas le cercle de précision
    // car l'information accuracy n'est pas dans le type Position
    // Si nécessaire, on peut l'ajouter plus tard
  }

  // Fonction de nettoyage
  const cleanupMarkers = () => {
    if (!mapInstance.value) return

    // Nettoyer les marqueurs utilisateur
    if (userMarker.value) {
      mapInstance.value.removeLayer(userMarker.value)
      userMarker.value = null
    }
    if (userAccuracyCircle.value) {
      mapInstance.value.removeLayer(userAccuracyCircle.value)
      userAccuracyCircle.value = null
    }

    // Nettoyer les marqueurs de lieux
    placeMarkers.value.forEach((marker) => {
      if (mapInstance.value) {
        mapInstance.value.removeLayer(marker)
      }
    })
    placeMarkers.value = []
  }

  return {
    createPlaceMarkers,
    updateUserPosition,
    cleanupMarkers,
  }
}
