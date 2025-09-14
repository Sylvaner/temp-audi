<template>
  <div v-if="hasAudio" class="is-flex is-justify-content-center">
    <button
      class="button is-rounded is-normal is-autumn-warning"
      @click="stopAudio"
      :disabled="isLoading"
      :title="t('audio.stop')"
    >
      <span class="icon">
        <i class="fas fa-stop"></i>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAudioStore } from '@/stores/audio'

const { t } = useI18n()
const audioStore = useAudioStore()

// Audio state computed properties
const isLoading = computed(() => audioStore.isLoading)
const hasAudio = computed(() => audioStore.hasAudio)

function stopAudio() {
  audioStore.stopCurrent()
}
</script>

<style scoped>
/* Classe personnalisée pour le bouton d'arrêt */
.button.is-autumn-warning {
  background-color: var(--color-warm);
  border-color: var(--color-warm);
  color: var(--color-white);
  box-shadow: var(--shadow-light);
}

.button.is-autumn-warning:hover:not(:disabled) {
  background-color: var(--color-warm-dark);
  border-color: var(--color-warm-dark);
  transform: scale(1.05);
  box-shadow: var(--shadow-medium);
}

.button.is-autumn-warning:active {
  transform: scale(1.02);
}
</style>
