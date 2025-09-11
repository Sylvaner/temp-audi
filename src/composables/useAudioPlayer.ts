import { ref, onUnmounted } from 'vue'

export function useAudioPlayer() {
  const currentAudio = ref<HTMLAudioElement | null>(null)
  const isPlaying = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentTime = ref(0)
  const duration = ref(0)

  // Arrêter et nettoyer l'audio précédent
  const stopCurrent = () => {
    if (currentAudio.value) {
      currentAudio.value.pause()
      currentAudio.value.currentTime = 0
      currentAudio.value = null
    }
    isPlaying.value = false
    isLoading.value = false
    currentTime.value = 0
    duration.value = 0
  }

  // Jouer un fichier audio
  const playAudio = async (audioFile: string) => {
    if (!audioFile) {
      error.value = 'Aucun fichier audio spécifié'
      return false
    }

    try {
      // Arrêter l'audio précédent s'il y en a un
      stopCurrent()

      error.value = null
      isLoading.value = true

      // Créer un nouvel élément audio
      const audio = new Audio(`/audio/${audioFile}`)
      currentAudio.value = audio

      // Gérer les événements audio
      audio.addEventListener('loadstart', () => {
        isLoading.value = true
      })

      audio.addEventListener('canplay', () => {
        isLoading.value = false
        duration.value = audio.duration || 0
      })

      audio.addEventListener('play', () => {
        isPlaying.value = true
      })

      audio.addEventListener('pause', () => {
        isPlaying.value = false
      })

      audio.addEventListener('ended', () => {
        isPlaying.value = false
        currentTime.value = 0
      })

      audio.addEventListener('timeupdate', () => {
        currentTime.value = audio.currentTime || 0
      })

      audio.addEventListener('error', (e) => {
        console.error('Erreur lors de la lecture audio:', e)
        error.value = 'Erreur lors de la lecture du fichier audio'
        isLoading.value = false
        isPlaying.value = false
      })

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

  // Mettre en pause
  const pauseAudio = () => {
    if (currentAudio.value && isPlaying.value) {
      currentAudio.value.pause()
    }
  }

  // Reprendre la lecture
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

  // Basculer lecture/pause
  const togglePlayback = async () => {
    if (isPlaying.value) {
      pauseAudio()
    } else {
      await resumeAudio()
    }
  }

  // Changer la position de lecture
  const seekTo = (time: number) => {
    if (currentAudio.value) {
      currentAudio.value.currentTime = Math.max(0, Math.min(time, duration.value))
    }
  }

  // Nettoyer lors de la destruction du composant
  onUnmounted(() => {
    stopCurrent()
  })

  return {
    // État
    isPlaying,
    isLoading,
    error,
    currentTime,
    duration,

    // Méthodes
    playAudio,
    pauseAudio,
    resumeAudio,
    togglePlayback,
    stopCurrent,
    seekTo,
  }
}
