/**
 * Composable pour améliorer l'accessibilité des composants audio
 * Fournit les attributs ARIA et la navigation clavier appropriés
 */

import { computed, ref, onMounted, onUnmounted, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'

export interface AudioAccessibilityOptions {
  placeId: string
  placeName: string
  isPlaying: Ref<boolean>
  isLoading: Ref<boolean>
  hasError: Ref<boolean>
  progress?: Ref<number>
}

export interface AudioAccessibilityState {
  // Attributs ARIA
  ariaLabel: Ref<string>
  ariaPressed: Ref<boolean>
  ariaDisabled: Ref<boolean>
  ariaLive: Ref<'off' | 'polite' | 'assertive'>
  ariaBusy: Ref<boolean>
  
  // Description pour lecteur d'écran
  ariaDescription: Ref<string>
  
  // Gestion clavier
  onKeydown: (event: KeyboardEvent) => void
  
  // Messages d'état
  statusMessage: Ref<string>
}

/**
 * Composable pour l'accessibilité des contrôles audio
 */
export function useAudioAccessibility(options: AudioAccessibilityOptions): AudioAccessibilityState {
  const { t } = useI18n()
  const { placeId, placeName, isPlaying, isLoading, hasError, progress } = options

  // Messages d'état pour les lecteurs d'écran
  const statusMessage = ref<string>('')
  const lastStatusUpdate = ref<number>(0)

  // Attributs ARIA calculés
  const ariaLabel = computed(() => {
    if (isLoading.value) {
      return t('audio.loading', { place: placeName })
    }
    if (hasError.value) {
      return t('audio.error', { place: placeName })
    }
    if (isPlaying.value) {
      return t('audio.pause', { place: placeName })
    }
    return t('audio.play', { place: placeName })
  })

  const ariaPressed = computed(() => isPlaying.value)
  const ariaDisabled = computed(() => isLoading.value || hasError.value)
  const ariaBusy = computed(() => isLoading.value)
  
  const ariaLive = computed<'off' | 'polite' | 'assertive'>(() => {
    if (hasError.value) return 'assertive'
    if (isLoading.value || isPlaying.value) return 'polite'
    return 'off'
  })

  const ariaDescription = computed(() => {
    const parts = [t('audio.description.control', { place: placeName })]
    
    if (progress?.value !== undefined) {
      const progressPercent = Math.round(progress.value)
      parts.push(t('audio.description.progress', { percent: progressPercent }))
    }
    
    parts.push(t('audio.description.keyboard'))
    
    return parts.join(' ')
  })

  // Gestion des messages de statut pour éviter le spam
  const updateStatusMessage = (message: string) => {
    const now = Date.now()
    if (now - lastStatusUpdate.value > 1000) { // Throttle à 1 seconde
      statusMessage.value = message
      lastStatusUpdate.value = now
    }
  }

  // Watchers pour les changements d'état
  const setupStatusWatchers = () => {
    // Watcher pour les changements de lecture
    const unwatchPlaying = () => {
      if (isPlaying.value) {
        updateStatusMessage(t('audio.status.playing', { place: placeName }))
      } else {
        updateStatusMessage(t('audio.status.paused', { place: placeName }))
      }
    }

    // Watcher pour les erreurs
    const unwatchError = () => {
      if (hasError.value) {
        updateStatusMessage(t('audio.status.error', { place: placeName }))
      }
    }

    // Watcher pour le chargement
    const unwatchLoading = () => {
      if (isLoading.value) {
        updateStatusMessage(t('audio.status.loading', { place: placeName }))
      }
    }

    return [unwatchPlaying, unwatchError, unwatchLoading]
  }

  // Gestion de la navigation clavier
  const onKeydown = (event: KeyboardEvent) => {
    switch (event.key) {
      case ' ': // Espace = play/pause
      case 'Enter': // Entrée = play/pause
        event.preventDefault()
        if (!isLoading.value && !hasError.value) {
          // Trigger de l'action de lecture (à implémenter par le composant parent)
          event.target?.dispatchEvent(new CustomEvent('audio-toggle'))
        }
        break
        
      case 'Escape': // Échap = arrêter
        if (isPlaying.value) {
          event.target?.dispatchEvent(new CustomEvent('audio-stop'))
        }
        break
        
      case 'ArrowLeft': // Flèche gauche = reculer
        if (isPlaying.value) {
          event.preventDefault()
          event.target?.dispatchEvent(new CustomEvent('audio-seek', { 
            detail: { direction: 'backward', seconds: 10 } 
          }))
        }
        break
        
      case 'ArrowRight': // Flèche droite = avancer
        if (isPlaying.value) {
          event.preventDefault()
          event.target?.dispatchEvent(new CustomEvent('audio-seek', { 
            detail: { direction: 'forward', seconds: 10 } 
          }))
        }
        break
    }
  }

  onMounted(() => {
    setupStatusWatchers()
  })

  return {
    // Attributs ARIA
    ariaLabel,
    ariaPressed,
    ariaDisabled,
    ariaLive,
    ariaBusy,
    ariaDescription,
    
    // Gestion clavier
    onKeydown,
    
    // Messages d'état
    statusMessage,
  }
}
