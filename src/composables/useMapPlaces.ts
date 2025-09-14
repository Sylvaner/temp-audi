import { ref } from 'vue'
import { useAudioStore } from '@/stores/audio'
import { useLanguageStore } from '@/stores/language'
import type { Place } from '@/types'

/**
 * Composable pour la gestion des lieux dans la vue carte
 * Centralise la logique de sélection, popup et navigation vers les lieux
 */
export function useMapPlaces(leafletMapRef: any, data: any) {
  const audioStore = useAudioStore()
  const languageStore = useLanguageStore()

  // État local
  const selectedPlace = ref<any>(null)

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
  const onPlaceDetails = (place: any) => {
    console.log('Détails du lieu demandés:', place)
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
  const onMapClick = (event: any) => {
    console.log('Clic sur la carte:', event.latlng)
    // Fermer le popup si ouvert lors du clic sur la carte
    if (selectedPlace.value) {
      closePopup()
    }
  }

  return {
    // États
    selectedPlace,

    // Actions
    startAudioPreloading,
    onPlaceDetails,
    closePopup,
    goToPlace,
    onMapClick,
  }
}
