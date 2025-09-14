<template>
  <div v-if="audioFile" class="audio-controls">
    <div class="media">
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
      <div class="media-content">
        <p class="has-text-weight-medium">
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

.audio-controls .media {
  align-items: center; /* Centrer verticalement tous les éléments */
}

.audio-controls .media-content {
  display: flex;
  align-items: center; /* Centrer verticalement le texte */
}

.audio-controls .media-content p {
  margin: 0; /* Supprimer les marges par défaut */
}

/* Mobile */
@media screen and (max-width: 768px) {
  .audio-controls {
    padding: 1rem 1.5rem;
  }

  .audio-controls .media {
    align-items: center; /* Assurer l'alignement même sur mobile */
  }
}
</style>
