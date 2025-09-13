<template>
  <div v-if="hasAudio" class="audio-controls">
    <button
      class="control-button"
      @click="stopAudio"
      :disabled="isLoading"
      title="Arrêter l'audio"
    >
      <i class="fas fa-stop"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAudioStore } from '@/stores/audio'

const audioStore = useAudioStore()

// Audio state computed properties
const isLoading = computed(() => audioStore.isLoading)
const hasAudio = computed(() => audioStore.hasAudio)

function stopAudio() {
  audioStore.stopCurrent()
}
</script>

<style scoped>
.audio-controls {
  display: flex;
  justify-content: center;
}

.control-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: var(--color-warm);
  color: var(--color-white);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  backdrop-filter: blur(4px);
  transition: all var(--transition-fast);
}

.control-button:hover {
  background: var(--color-secondary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}

.control-button:active {
  transform: scale(1.02);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.control-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.control-button:disabled:hover {
  background: var(--color-warm);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transform: none;
}
</style>
