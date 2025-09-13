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

  // États de prétéléchargement
  const preloadedAudios = ref<Map<string, HTMLAudioElement>>(new Map())
  const downloadQueue = ref<string[]>([])
  const downloadingFiles = ref<Set<string>>(new Set())
  const downloadedFiles = ref<Set<string>>(new Set())
  const maxConcurrentDownloads = 5

  // Computed
  const hasAudio = computed(() => currentAudio.value !== null && isPlaying.value)
  const hasPlayedAnyAudio = computed(() => playedPlaces.value.size > 0)
  const progress = computed(() => {
    if (duration.value === 0) return 0
    return (currentTime.value / duration.value) * 100
  })

  // Computed pour le prétéléchargement
  const isDownloading = (audioFile: string) => {
    return downloadingFiles.value.has(audioFile)
  }

  const isDownloaded = (audioFile: string) => {
    return downloadedFiles.value.has(audioFile)
  }

  const getDownloadState = (audioFile: string): 'none' | 'downloading' | 'downloaded' => {
    if (downloadingFiles.value.has(audioFile)) return 'downloading'
    if (downloadedFiles.value.has(audioFile)) return 'downloaded'
    return 'none'
  }

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

  // Fonctions de prétéléchargement
  const preloadAudio = async (audioFile: string): Promise<HTMLAudioElement> => {
    return new Promise((resolve, reject) => {
      // Si déjà prétéléchargé, retourner l'instance existante
      if (preloadedAudios.value.has(audioFile)) {
        resolve(preloadedAudios.value.get(audioFile)!)
        return
      }

      // Marquer comme en cours de téléchargement
      downloadingFiles.value.add(audioFile)

      const audio = new Audio()
      audio.preload = 'auto'

      const onCanPlayThrough = () => {
        // Téléchargement terminé
        downloadingFiles.value.delete(audioFile)
        downloadedFiles.value.add(audioFile)
        preloadedAudios.value.set(audioFile, audio)

        // Nettoyer les listeners
        audio.removeEventListener('canplaythrough', onCanPlayThrough)
        audio.removeEventListener('error', onPreloadError)

        // Traiter le prochain dans la queue
        processDownloadQueue()

        resolve(audio)
      }

      const onPreloadError = () => {
        console.error('Erreur lors du prétéléchargement de:', audioFile)
        downloadingFiles.value.delete(audioFile)

        // Nettoyer les listeners
        audio.removeEventListener('canplaythrough', onCanPlayThrough)
        audio.removeEventListener('error', onPreloadError)

        // Traiter le prochain dans la queue
        processDownloadQueue()

        reject(new Error(`Impossible de prétélécharger ${audioFile}`))
      }

      audio.addEventListener('canplaythrough', onCanPlayThrough)
      audio.addEventListener('error', onPreloadError)

      audio.src = `/audio/${audioFile}`
    })
  }

  const processDownloadQueue = () => {
    // Si on a atteint la limite de téléchargements simultanés, attendre
    if (downloadingFiles.value.size >= maxConcurrentDownloads) {
      return
    }

    // Prendre le prochain fichier dans la queue
    const nextFile = downloadQueue.value.shift()
    if (nextFile && !downloadingFiles.value.has(nextFile) && !downloadedFiles.value.has(nextFile)) {
      preloadAudio(nextFile).catch(console.error)
    }
  }

  const startPreloading = (audioFiles: string[]) => {
    // Ajouter les fichiers à la queue s'ils ne sont pas déjà téléchargés ou en cours
    audioFiles.forEach((audioFile) => {
      if (
        !downloadedFiles.value.has(audioFile) &&
        !downloadingFiles.value.has(audioFile) &&
        !downloadQueue.value.includes(audioFile)
      ) {
        downloadQueue.value.push(audioFile)
      }
    })

    // Démarrer le téléchargement avec la limite de concurrence
    for (let i = 0; i < Math.min(maxConcurrentDownloads, downloadQueue.value.length); i++) {
      processDownloadQueue()
    }
  }

  const startPreloadingForLanguage = (places: any[], language: string) => {
    const audioFiles: string[] = []

    // Trier par ordre et extraire les fichiers audio pour la langue donnée
    places
      .slice()
      .sort((a, b) => a.order - b.order)
      .forEach((place) => {
        if (place.content[language]?.audioFile) {
          audioFiles.push(place.content[language].audioFile)
        }
      })

    console.log(`Démarrage du prétéléchargement pour ${language}:`, audioFiles.length, 'fichiers')
    startPreloading(audioFiles)
  }

  const getPreloadedAudio = (audioFile: string): HTMLAudioElement | null => {
    return preloadedAudios.value.get(audioFile) || null
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
      let audio = getPreloadedAudio(audioFile)

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

      // Ajouter les event listeners
      currentAudio.value.addEventListener('loadstart', onLoadStart)
      currentAudio.value.addEventListener('canplay', onCanPlay)
      currentAudio.value.addEventListener('play', onPlay)
      currentAudio.value.addEventListener('pause', onPause)
      currentAudio.value.addEventListener('ended', onEnded)
      currentAudio.value.addEventListener('timeupdate', onTimeUpdate)
      currentAudio.value.addEventListener('error', onError)

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

    // États de prétéléchargement
    isDownloading,
    isDownloaded,
    getDownloadState,

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

    // Actions de prétéléchargement
    startPreloading,
    startPreloadingForLanguage,
    getPreloadedAudio,
  }
})
