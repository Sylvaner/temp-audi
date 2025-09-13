import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAudioStore = defineStore('audio', () => {
  // État
  const currentPlace = ref<string | null>(null)
  const currentAudio = ref<HTMLAudioElement | null>(null)
  const isPlaying = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentTime = ref(0)
  const duration = ref(0)
  const playedPlaces = ref<Set<string>>(new Set()) // Places qui ont été jouées au moins une fois

  // Computed
  const hasAudio = computed(() => currentAudio.value !== null)
  const hasPlayedAnyAudio = computed(() => playedPlaces.value.size > 0)
  const progress = computed(() => {
    if (duration.value === 0) return 0
    return (currentTime.value / duration.value) * 100
  })

  // Actions
  const stopCurrent = () => {
    if (currentAudio.value) {
      currentAudio.value.pause()
      currentAudio.value.removeEventListener('loadstart', onLoadStart)
      currentAudio.value.removeEventListener('canplay', onCanPlay)
      currentAudio.value.removeEventListener('play', onPlay)
      currentAudio.value.removeEventListener('pause', onPause)
      currentAudio.value.removeEventListener('ended', onEnded)
      currentAudio.value.removeEventListener('timeupdate', onTimeUpdate)
      currentAudio.value.removeEventListener('error', onError)
      currentAudio.value = null
    }
    currentPlace.value = null
    isPlaying.value = false
    isLoading.value = false
    currentTime.value = 0
    duration.value = 0
    error.value = null
  }

  // Event handlers
  const onLoadStart = () => {
    isLoading.value = true
  }

  const onCanPlay = () => {
    isLoading.value = false
    if (currentAudio.value) {
      duration.value = currentAudio.value.duration || 0
    }
  }

  const onPlay = () => {
    isPlaying.value = true
    // Marquer la place comme jouée
    if (currentPlace.value) {
      markPlaceAsPlayed(currentPlace.value)
    }
  }

  const onPause = () => {
    isPlaying.value = false
  }

  const onEnded = () => {
    isPlaying.value = false
    currentTime.value = 0
  }

  const onTimeUpdate = () => {
    if (currentAudio.value) {
      currentTime.value = currentAudio.value.currentTime || 0
    }
  }

  const onError = (e: Event) => {
    console.error('Erreur lors de la lecture audio:', e)
    error.value = 'Erreur lors de la lecture du fichier audio'
    isLoading.value = false
    isPlaying.value = false
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

      // Créer un nouvel élément audio
      const audio = new Audio(`/audio/${audioFile}`)
      currentAudio.value = audio

      // Ajouter les event listeners
      audio.addEventListener('loadstart', onLoadStart)
      audio.addEventListener('canplay', onCanPlay)
      audio.addEventListener('play', onPlay)
      audio.addEventListener('pause', onPause)
      audio.addEventListener('ended', onEnded)
      audio.addEventListener('timeupdate', onTimeUpdate)
      audio.addEventListener('error', onError)

      // Lancer la lecture
      await audio.play()
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

  // Méthode pour marquer une place comme jouée
  const markPlaceAsPlayed = (placeId: string) => {
    playedPlaces.value.add(placeId)
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
  }
})
