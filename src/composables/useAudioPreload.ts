/**
 * Composable pour la gestion simplifiée du prétéléchargement audio
 * Sépare la logique de prétéléchargement de la logique de lecture
 */

import { ref } from 'vue'
import type { Place } from '@/types'

// Interface simplifiée pour le gestionnaire de préchargement
export type AudioPreloadManager = {
  // États en lecture seule
  readonly downloadQueue: string[]
  readonly downloadingFiles: Set<string>
  readonly downloadedFiles: Set<string>
  readonly preloadedAudios: Map<string, HTMLAudioElement>

  // Méthodes principales
  startPreloading: (audioFiles: string[]) => void
  startPreloadingForLanguage: (places: Place[], language: string) => void
  getPreloadedAudio: (audioFile: string) => HTMLAudioElement | null
  isDownloading: (audioFile: string) => boolean
  isDownloaded: (audioFile: string) => boolean
  getDownloadState: (audioFile: string) => 'none' | 'downloading' | 'downloaded'
}

/**
 * Crée un gestionnaire de prétéléchargement audio
 */
export function useAudioPreload(maxConcurrentDownloads = 5): AudioPreloadManager {
  // États de prétéléchargement
  const preloadedAudios = ref<Map<string, HTMLAudioElement>>(new Map())
  const downloadQueue = ref<string[]>([])
  const downloadingFiles = ref<Set<string>>(new Set())
  const downloadedFiles = ref<Set<string>>(new Set())

  // Computed
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

  // Fonctions internes
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

  // Méthodes publiques
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

  const startPreloadingForLanguage = (places: Place[], language: string) => {
    const audioFiles: string[] = []

    // Trier par ordre et extraire les fichiers audio pour la langue donnée
    places
      .slice()
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
      .forEach((place) => {
        if (place.content[language]?.audioFile) {
          audioFiles.push(place.content[language].audioFile)
        }
      })

    startPreloading(audioFiles)
  }

  const getPreloadedAudio = (audioFile: string): HTMLAudioElement | null => {
    return preloadedAudios.value.get(audioFile) || null
  }

  return {
    // États (en lecture seule)
    get downloadQueue() {
      return downloadQueue.value
    },
    get downloadingFiles() {
      return downloadingFiles.value
    },
    get downloadedFiles() {
      return downloadedFiles.value
    },
    get preloadedAudios() {
      return preloadedAudios.value
    },

    // Méthodes publiques
    startPreloading,
    startPreloadingForLanguage,
    getPreloadedAudio,
    isDownloading,
    isDownloaded,
    getDownloadState,
  }
}
