/**
 * Composable optimisé pour l'état des contrôles audio d'un lieu
 * Regroupe les computed properties liées à l'audio en un seul
 */

import { computed, type ComputedRef } from 'vue'
import { useAudioStore } from '@/stores/audio'

export interface PlaceAudioState {
  isPlaying: boolean
  isLoading: boolean
  hasError: boolean
  errorMessage: string | null
  hasBeenPlayed: boolean
  buttonClasses: string[]
  iconClass: string
}

/**
 * Composable optimisé pour l'état audio d'un lieu
 */
export function usePlaceAudioState(placeId: string): ComputedRef<PlaceAudioState> {
  const audioStore = useAudioStore()

  // Un seul computed pour tous les états audio du lieu
  return computed((): PlaceAudioState => {
    const isPlaying = audioStore.isPlacePlayingAudio(placeId)
    const isLoading = audioStore.isPlaceAudioLoading(placeId)
    const error = audioStore.error
    const hasBeenPlayed = audioStore.hasPlaceBeenPlayed(placeId)

    // Classes CSS du bouton audio
    const buttonClasses = ['button', 'audio-button']
    let iconClass = 'fa-play'

    // Logique unifiée pour les classes et icônes
    if (isLoading) {
      buttonClasses.push('is-loading', 'is-autumn-info')
      iconClass = 'fa-spinner fa-spin'
    } else if (error && audioStore.currentPlace === placeId) {
      buttonClasses.push('is-autumn-danger')
      iconClass = 'fa-exclamation-triangle'
    } else if (isPlaying) {
      buttonClasses.push('is-autumn-success', 'has-pulse-animation')
      iconClass = 'fa-pause'
    } else if (hasBeenPlayed) {
      buttonClasses.push('is-autumn-secondary')
      iconClass = 'fa-play'
    } else {
      buttonClasses.push('is-autumn-primary')
      iconClass = 'fa-play'
    }

    return {
      isPlaying,
      isLoading,
      hasError: !!error && audioStore.currentPlace === placeId,
      errorMessage: error,
      hasBeenPlayed,
      buttonClasses,
      iconClass,
    }
  })
}
