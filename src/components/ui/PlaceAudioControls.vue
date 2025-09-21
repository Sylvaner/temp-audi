<template>
  <div v-if="audioFile" class="audio-controls">
    <div class="media is-align-items-center">
      <div class="media-left">
        <button
          class="button is-rounded is-primary"
          :class="{ 'is-loading': isLoading, 'is-warning': isPlaying }"
          @click="toggleAudio"
          :disabled="isLoading"
        >
          <span class="icon">
            <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
          </span>
        </button>
      </div>
      <div class="media-content is-flex is-align-items-center">
        <p class="has-text-weight-medium m-0">
          {{ isPlaying ? $t('audio.pause') : $t('audio.listen') }}
        </p>
      </div>
    </div>

    <div v-if="error" class="notification is-danger is-light mt-3">
      <button class="delete" @click="error = null"></button>
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAudioStore } from '@/stores/audio'
import { useI18n } from 'vue-i18n'

interface Props {
  placeId: string
  audioFile: string
}

const props = defineProps<Props>()
const audioStore = useAudioStore()
const { t } = useI18n()

const error = ref<string | null>(null)
const isLoading = computed(() => audioStore.isPlaceAudioLoading(props.placeId))
const isPlaying = computed(() => audioStore.isPlacePlayingAudio(props.placeId))

const toggleAudio = async () => {
  try {
    error.value = null

    if (isPlaying.value) {
      audioStore.pauseAudio()
    } else {
      await audioStore.playAudio(props.placeId, props.audioFile)
    }
  } catch (err) {
    console.error('Erreur lors de la lecture audio:', err)
    error.value = t('errors.audioPlayback')
  }
}
</script>

<style scoped>
.audio-controls {
  padding: 1.5rem;
  background: var(--color-background-light);
  border-top: 1px solid var(--color-border-light);
}

@media screen and (max-width: 768px) {
  .audio-controls {
    padding: 1rem 1.5rem;
  }
}
</style>
