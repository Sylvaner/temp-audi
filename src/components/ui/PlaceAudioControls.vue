<template>
  <div v-if="audioFile" class="audio-controls">
    <div class="media is-align-items-center">
      <div class="media-left">
        <button
          class="button is-rounded is-primary"
          :class="audioButtonClasses"
          @click="toggleAudio"
          :disabled="isLoading"
        >
          <span class="icon">
            <i :class="audioButtonIcon"></i>
          </span>
        </button>
      </div>
      <div class="media-content is-flex is-align-items-center">
        <p class="has-text-weight-medium m-0">
          {{ audioButtonText }}
        </p>
      </div>
    </div>

    <!-- Message d'erreur si nécessaire -->
    <div v-if="error" class="notification is-danger is-light mt-3">
      <button class="delete" @click="error = null"></button>
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlaceAudio } from '@/composables/usePlaceAudio'

interface Props {
  placeId: string
  audioFile: string
}

const props = defineProps<Props>()

// Utilise le composable pour toute la logique audio
const { isLoading, error, audioButtonClasses, audioButtonText, audioButtonIcon, toggleAudio } =
  usePlaceAudio(props.placeId, props.audioFile)
</script>

<style scoped>
.audio-controls {
  padding: 1.5rem;
  background: var(--color-background-light);
  border-top: 1px solid var(--color-border-light);
}

/* Mobile */
@media screen and (max-width: 768px) {
  .audio-controls {
    padding: 1rem 1.5rem;
  }
}
</style>
