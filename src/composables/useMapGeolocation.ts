import { ref, computed } from 'vue'
import { useGeolocationStore } from '@/stores/geolocation'
import type { Position } from '@/types'

// Interface pour la référence Leaflet Map
interface LeafletMapRef {
  value: {
    centerOnUser(): void
    setView(position: Position, zoom: number): void
  } | null
}

/**
 * Composable pour la gestion de la géolocalisation dans la vue carte
 * Centralise toute la logique de permissions, modal et centrage utilisateur
 */
export function useMapGeolocation(leafletMapRef: LeafletMapRef) {
  const geolocationStore = useGeolocationStore()

  // État local de la géolocalisation
  const showGeolocationModal = ref(false)
  const hasRequestedGeolocation = ref(false)
  const hasInitialCentering = ref(false)

  // Computed
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

        console.log('Centrage initial effectué après acceptation de la géolocalisation')
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

  return {
    // États
    showGeolocationModal,
    modalType,

    // Actions
    requestInitialGeolocation,
    centerOnUser,
    handleAllowGeolocation,
    handleDenyGeolocation,
    handleRetryGeolocation,
  }
}
