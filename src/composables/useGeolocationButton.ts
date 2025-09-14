/**
 * Composable optimisé pour GeolocationButton
 * Regroupe les computed properties en un seul pour éviter les recalculs multiples
 */

import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGeolocationStore } from '@/stores/geolocation'

export interface GeolocationButtonState {
  buttonClass: string[]
  iconClass: string
  buttonText: string
  buttonTitle: string
  isDisabled: boolean
}

/**
 * Composable optimisé pour l'état du bouton géolocalisation
 */
export function useGeolocationButton(size: string = 'normal'): ComputedRef<GeolocationButtonState> {
  const { t } = useI18n()
  const geolocationStore = useGeolocationStore()

  // Un seul computed pour tous les états du bouton
  return computed((): GeolocationButtonState => {
    const permissionStatus = geolocationStore.permissionStatus
    const isAvailable = geolocationStore.isLocationAvailable

    // Classes CSS du bouton
    const buttonClass = [`is-${size}`]
    let iconClass = 'fa-location-crosshairs'
    let buttonText = t('map.centerOnUser')
    let buttonTitle = 'Centrer la carte sur votre position'
    let isDisabled = false

    // Logique unifiée basée sur le status
    if (!isAvailable) {
      buttonClass.push('is-static')
      iconClass = 'fa-location-slash'
      buttonText = t('geolocation.unavailable')
      buttonTitle = 'Géolocalisation non disponible'
      isDisabled = true
    } else {
      switch (permissionStatus) {
        case 'granted':
          buttonClass.push('is-autumn-success')
          iconClass = 'fa-location-crosshairs'
          buttonText = t('map.centerOnUser')
          buttonTitle = 'Centrer la carte sur votre position'
          break

        case 'denied':
          buttonClass.push('is-autumn-warning')
          iconClass = 'fa-location-slash'
          buttonText = t('geolocation.denied.retry')
          buttonTitle = 'Réessayer la géolocalisation'
          break

        case 'requesting':
          buttonClass.push('is-loading', 'is-autumn-info')
          iconClass = 'fa-spinner fa-spin'
          buttonText = t('common.loading')
          buttonTitle = 'Demande de permission en cours...'
          isDisabled = true
          break

        default: // 'unknown'
          buttonClass.push('is-autumn-primary')
          iconClass = 'fa-location-crosshairs'
          buttonText = t('map.centerOnUser')
          buttonTitle = 'Demander la permission de géolocalisation'
      }
    }

    return {
      buttonClass,
      iconClass,
      buttonText,
      buttonTitle,
      isDisabled,
    }
  })
}
