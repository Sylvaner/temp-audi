import { computed } from 'vue'
import { useAudioStore } from '@/stores/audio'

export function useAudioPlayer() {
  const audioStore = useAudioStore()

  const hasAudio = computed(() => audioStore.hasAudio)
  const isLoading = computed(() => audioStore.isLoading)
  const error = computed(() => audioStore.error)

  async function playAudio(placeId: string, audioFile: string) {
    try {
      await audioStore.playAudio(placeId, audioFile)
    } catch (err) {
      console.error('Erreur lecture audio:', err)
    }
  }

  function stopCurrent() {
    audioStore.stopCurrent()
  }

  function isPlacePlayingAudio(placeId: string): boolean {
    return audioStore.currentPlace === placeId && audioStore.isPlaying
  }

  function isPlaceAudioLoading(placeId: string): boolean {
    return audioStore.currentPlace === placeId && audioStore.isLoading
  }

  function hasPlaceBeenPlayed(placeId: string): boolean {
    return audioStore.hasPlayedAnyAudio
  }

  return {
    hasAudio,
    isLoading,
    error,
    playAudio,
    stopCurrent,
    isPlacePlayingAudio,
    isPlaceAudioLoading,
    hasPlaceBeenPlayed,
  }
}
