<template>
  <div v-if="audioFile" class="media">
    <div class="media-left">
      <button
        class="button is-rounded"
        :class="{
          'is-primary': !isPlaying,
          'is-warning': isPlaying,
          'is-loading': isLoading,
          'has-pulse-animation': !hasBeenPlayed && !isPlaying,
        }"
        @click="$emit('play')"
        :disabled="isLoading"
        :title="isPlaying ? t('audio.pause') : t('audio.listen')"
      >
        <span class="icon is-small">
          <i v-if="downloadState === 'downloading'" class="fas fa-spinner fa-spin"></i>
          <i v-else :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
        </span>
      </button>
    </div>
    <div class="media-content">
      <p class="has-text-weight-medium">
        {{ isPlaying ? t('audio.pause') : t('audio.listen') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAudioStore } from '@/stores/audio'

interface Props {
  placeId: string
  audioFile: string
  isPlaying: boolean
  isLoading: boolean
  hasBeenPlayed: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  play: []
}>()

const { t } = useI18n()
const audioStore = useAudioStore()

// États de prétéléchargement
const downloadState = computed(() => {
  if (!props.audioFile) return 'none'
  return audioStore.getDownloadState(props.audioFile)
})
</script>

<style scoped>
.has-pulse-animation {
  animation: pulse 2s ease-out infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 hsl(348, 100%, 61%);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}
</style>
