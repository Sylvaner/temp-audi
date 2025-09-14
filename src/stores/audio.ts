import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAudioEventHandlers, attachAudioEventHandlers, detachAudioEventHandlers } from '@/composables/useAudioEventHandlers'
import { useAudioPreload } from '@/composables/useAudioPreload'

export const useAudioStore = defineStore('audio', () => {
  // État principal de lecture
  const currentPlace = ref<string | null>(null)
  const currentAudio = ref<HTMLAudioElement | null>(null)
  const isPlaying = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentTime = ref(0)
  const duration = ref(0)
  const playedPlaces = ref<Set<string>>(new Set()) // Places qui ont été jouées au moins une fois

  // Gestionnaire de prétéléchargement (composable)
  const preloadManager = useAudioPreload(5)

  // Computed
  const hasAudio = computed(() => currentAudio.value !== null && isPlaying.value)
  const hasPlayedAnyAudio = computed(() => playedPlaces.value.size > 0)
  const progress = computed(() => {
    if (duration.value === 0) return 0
    return (currentTime.value / duration.value) * 100
  })

  // Méthode pour marquer une place comme jouée
  const markPlaceAsPlayed = (placeId: string) => {
    playedPlaces.value.add(placeId)
  }

  // Event handlers (composable)
  const eventHandlers = useAudioEventHandlers({
    isLoading,
    isPlaying,
    currentTime,
    error,
    currentPlace,
    onPlaceMarkedAsPlayed: markPlaceAsPlayed,
  })

  // Actions
  const stopCurrent = () => {
    if (currentAudio.value) {
      currentAudio.value.pause()
      detachAudioEventHandlers(currentAudio.value, eventHandlers)
      currentAudio.value = null
    }
    currentPlace.value = null
    isPlaying.value = false
    isLoading.value = false
    currentTime.value = 0
    duration.value = 0
    error.value = null
  }

  // Méthodes de mise à jour depuis les event handlers
  const updateAudioDuration = () => {
    if (currentAudio.value) {
      duration.value = currentAudio.value.duration || 0
    }
  }

  const updateAudioCurrentTime = () => {
    if (currentAudio.value) {
      currentTime.value = currentAudio.value.currentTime || 0
    }
  }

  const playAudio = async (placeId: string, audioFile: string) => {
    if (!audioFile) {
      error.value = 'Aucun fichier audio spécifié'
      return false
    }

    try {
      // Si c'est le même lieu et qu'on est en train de jouer, on met en pause
      if (currentPlace.value === placeId && isPlaying.value) {
        currentAudio.value?.pause()
        return true
      }

      // Si c'est le même lieu mais en pause, on reprend
      if (currentPlace.value === placeId && currentAudio.value) {
        await currentAudio.value.play()
        return true
      }

      // Arrêter l'audio précédent
      stopCurrent()

      error.value = null
      currentPlace.value = placeId

      // Utiliser l'audio prétéléchargé si disponible
      let audio = preloadManager.getPreloadedAudio(audioFile)

      if (audio) {
        // Si prétéléchargé, réutiliser directement sans cloner
        audio.currentTime = 0
        audio.pause() // S'assurer qu'il est en pause
        currentAudio.value = audio
      } else {
        // Créer un nouvel élément audio
        audio = new Audio(`/audio/${audioFile}`)
        currentAudio.value = audio
      }

      // Ajouter les event listeners via le composable
      attachAudioEventHandlers(currentAudio.value, {
        ...eventHandlers,
        onCanPlay: () => {
          eventHandlers.onCanPlay()
          updateAudioDuration()
        },
        onTimeUpdate: () => {
          eventHandlers.onTimeUpdate()
          updateAudioCurrentTime()
        }
      })

      // Lancer la lecture
      await currentAudio.value.play()
      return true
    } catch (err) {
      console.error('Erreur lors du chargement audio:', err)
      error.value = 'Impossible de lire le fichier audio'
      isLoading.value = false
      isPlaying.value = false
      return false
    }
  }

  const pauseAudio = () => {
    if (currentAudio.value && isPlaying.value) {
      currentAudio.value.pause()
    }
  }

  const resumeAudio = async () => {
    if (currentAudio.value && !isPlaying.value) {
      try {
        await currentAudio.value.play()
      } catch (err) {
        console.error('Erreur lors de la reprise audio:', err)
        error.value = 'Impossible de reprendre la lecture'
      }
    }
  }

  const togglePlayback = async () => {
    if (isPlaying.value) {
      pauseAudio()
    } else {
      await resumeAudio()
    }
  }

  const seekTo = (time: number) => {
    if (currentAudio.value) {
      currentAudio.value.currentTime = Math.max(0, Math.min(time, duration.value))
    }
  }

  // Vérifier si un lieu donné est en cours de lecture
  const isPlacePlayingAudio = (placeId: string) => {
    return currentPlace.value === placeId && isPlaying.value
  }

  const isPlaceAudioLoading = (placeId: string) => {
    return currentPlace.value === placeId && isLoading.value
  }

  // Méthode pour vérifier si une place a été jouée
  const hasPlaceBeenPlayed = (placeId: string) => {
    return playedPlaces.value.has(placeId)
  }

  return {
    // État
    currentPlace,
    isPlaying,
    isLoading,
    error,
    currentTime,
    duration,
    hasAudio,
    hasPlayedAnyAudio,
    progress,

    // États de prétéléchargement (délégués au preload manager)
    isDownloading: preloadManager.isDownloading,
    isDownloaded: preloadManager.isDownloaded,
    getDownloadState: preloadManager.getDownloadState,

    // Actions
    playAudio,
    pauseAudio,
    resumeAudio,
    togglePlayback,
    stopCurrent,
    seekTo,
    isPlacePlayingAudio,
    isPlaceAudioLoading,
    hasPlaceBeenPlayed,
    markPlaceAsPlayed,

    // Actions de prétéléchargement (délégués au preload manager)
    startPreloading: preloadManager.startPreloading,
    startPreloadingForLanguage: preloadManager.startPreloadingForLanguage,
    getPreloadedAudio: preloadManager.getPreloadedAudio,
  }
})
