/**
 * Composable pour la gestion centralisée des event handlers audio
 * Permet de réutiliser la logique d'événements audio et simplifie le cleanup
 */

import { type Ref } from 'vue'

export interface AudioEventHandlers {
  onLoadStart: () => void
  onCanPlay: () => void
  onPlay: () => void
  onPause: () => void
  onEnded: () => void
  onTimeUpdate: () => void
  onError: (e: Event) => void
}

export interface AudioEventHandlersOptions {
  isLoading: Ref<boolean>
  isPlaying: Ref<boolean>
  currentTime: Ref<number>
  error: Ref<string | null>
  currentPlace: Ref<string | null>
  onPlaceMarkedAsPlayed?: (placeId: string) => void
}

/**
 * Crée un ensemble d'event handlers pour un élément audio
 */
export function useAudioEventHandlers(options: AudioEventHandlersOptions): AudioEventHandlers {
  const {
    isLoading,
    isPlaying,
    currentTime,
    error,
    currentPlace,
    onPlaceMarkedAsPlayed,
  } = options

  const handlers: AudioEventHandlers = {
    onLoadStart: () => {
      isLoading.value = true
    },

    onCanPlay: () => {
      isLoading.value = false
      // La durée sera mise à jour depuis le store
    },

    onPlay: () => {
      isPlaying.value = true
      // Marquer la place comme jouée
      if (currentPlace.value && onPlaceMarkedAsPlayed) {
        onPlaceMarkedAsPlayed(currentPlace.value)
      }
    },

    onPause: () => {
      isPlaying.value = false
    },

    onEnded: () => {
      isPlaying.value = false
      currentTime.value = 0
    },

    onTimeUpdate: () => {
      // Le currentTime sera mis à jour depuis le store
    },

    onError: (e: Event) => {
      console.error('Erreur lors de la lecture audio:', e)
      error.value = 'Erreur lors de la lecture du fichier audio'
      isLoading.value = false
      isPlaying.value = false
    },
  }

  return handlers
}

/**
 * Attache les event handlers à un élément audio
 */
export function attachAudioEventHandlers(
  audio: HTMLAudioElement,
  handlers: AudioEventHandlers
): void {
  audio.addEventListener('loadstart', handlers.onLoadStart)
  audio.addEventListener('canplay', handlers.onCanPlay)
  audio.addEventListener('play', handlers.onPlay)
  audio.addEventListener('pause', handlers.onPause)
  audio.addEventListener('ended', handlers.onEnded)
  audio.addEventListener('timeupdate', handlers.onTimeUpdate)
  audio.addEventListener('error', handlers.onError)
}

/**
 * Détache les event handlers d'un élément audio
 */
export function detachAudioEventHandlers(
  audio: HTMLAudioElement,
  handlers: AudioEventHandlers
): void {
  audio.removeEventListener('loadstart', handlers.onLoadStart)
  audio.removeEventListener('canplay', handlers.onCanPlay)
  audio.removeEventListener('play', handlers.onPlay)
  audio.removeEventListener('pause', handlers.onPause)
  audio.removeEventListener('ended', handlers.onEnded)
  audio.removeEventListener('timeupdate', handlers.onTimeUpdate)
  audio.removeEventListener('error', handlers.onError)
}
