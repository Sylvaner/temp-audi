import { ref, computed } from 'vue'
import { useAudioStore } from '@/stores/audio'
import { useI18n } from 'vue-i18n'

/**
 * Composable pour la gestion de l'audio d'un lieu
 * Centralise toute la logique audio et l'état d'un lieu spécifique
 */
export function usePlaceAudio(placeId: string, audioFile: string) {
  const audioStore = useAudioStore()
  const { t } = useI18n()

  // État local pour ce lieu spécifique
  const error = ref<string | null>(null)

  // États dérivés du store audio
  const isLoading = computed(() => audioStore.isPlaceAudioLoading(placeId))
  const isPlaying = computed(() => audioStore.isPlacePlayingAudio(placeId))
  const hasBeenPlayed = computed(() => audioStore.hasPlaceBeenPlayed(placeId))

  // Classes CSS pour le bouton audio
  const audioButtonClasses = computed(() => ({
    'is-loading': isLoading.value,
    'is-warning': isPlaying.value,
    'has-pulse-animation': !hasBeenPlayed.value && !isPlaying.value,
  }))

  // Texte du bouton audio
  const audioButtonText = computed(() => (isPlaying.value ? t('audio.pause') : t('audio.listen')))

  // Icône du bouton audio
  const audioButtonIcon = computed(() => (isPlaying.value ? 'fas fa-pause' : 'fas fa-play'))

  /**
   * Joue ou met en pause l'audio du lieu
   */
  const toggleAudio = async () => {
    try {
      error.value = null

      if (isPlaying.value) {
        audioStore.pauseAudio()
      } else {
        await audioStore.playAudio(placeId, audioFile)
      }
    } catch (err) {
      console.error('Erreur lors de la lecture audio:', err)
      error.value = t('errors.audioPlayback')
    }
  }

  /**
   * Arrête l'audio si c'est celui de ce lieu
   */
  const stopAudio = () => {
    if (audioStore.isPlacePlayingAudio(placeId)) {
      audioStore.stopCurrent()
    }
  }

  /**
   * Vérifie si l'audio de ce lieu est préchargé
   */
  const isPreloaded = computed(() => {
    return audioStore.getPreloadedAudio(audioFile) !== null
  })

  return {
    // États
    isLoading,
    isPlaying,
    hasBeenPlayed,
    error,
    isPreloaded,

    // Classes et textes computed
    audioButtonClasses,
    audioButtonText,
    audioButtonIcon,

    // Actions
    toggleAudio,
    stopAudio,
  }
}
