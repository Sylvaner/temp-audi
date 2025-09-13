<template>
  <div class="place-fullscreen">
    <!-- Bouton de fermeture -->
    <button class="close-button" @click="closePopup">
      <i class="fas fa-times"></i>
    </button>

    <!-- Image à gauche sur desktop, en haut sur mobile -->
    <div v-if="place.imageFile" class="place-image-section" @click="closePopup">
      <img :src="`/images/${place.imageFile}`" :alt="placeContent.title" @error="onImageError" />
    </div>

    <!-- Contenu à droite sur desktop, en bas sur mobile -->
    <div class="place-content-section">
      <!-- Zone de texte avec arrondi en haut -->
      <div class="place-text-area" @click="closePopup">
        <h1 class="place-title">{{ placeContent.title }}</h1>
        <div class="place-description">
          <p v-for="(paragraph, index) in textParagraphs" :key="index">
            {{ paragraph }}
          </p>
        </div>
      </div>

      <!-- Contrôles audio minimalistes -->
      <div v-if="placeContent.audioFile" class="place-audio-controls">
        <div class="audio-control-group">
          <div class="audio-button-container">
            <button
              class="audio-play-btn-minimal"
              :class="{ 'has-pulse-animation': !hasBeenPlayed && !isPlaying }"
              @click="playAudio"
              :disabled="isLoading"
              :title="isPlaying ? t('audio.pause') : t('audio.listen')"
            >
              <i
                v-if="downloadState === 'downloading'"
                class="fas fa-spinner fa-spin"
                style="font-size: 0.7em"
              ></i>
              <i v-else :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
            </button>
          </div>
          <span class="audio-label">{{ isPlaying ? t('audio.pause') : t('audio.listen') }}</span>
        </div>
      </div>
    </div>

    <div v-if="error" class="place-error">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/stores/language'
import { useAudioStore } from '@/stores/audio'

// Types
interface Place {
  id: string
  latitude: number
  longitude: number
  imageFile?: string
  content: Record<
    string,
    {
      title: string
      description: string
      text: string
      audioFile: string
    }
  >
}

// Props
interface Props {
  place: Place
}

const props = defineProps<Props>()

// Events
const emit = defineEmits<{
  close: []
}>()

// Composables
const { t } = useI18n()
const languageStore = useLanguageStore()
const audioStore = useAudioStore()

// État local - supprimé showFullText

// Computed
const placeContent = computed(() => {
  const lang = languageStore.currentLanguage?.code || 'fr'
  return props.place.content[lang] || props.place.content['fr']
})

// Divise le texte en paragraphes basés sur les retours à la ligne
const textParagraphs = computed(() => {
  if (!placeContent.value?.text) return []
  return placeContent.value.text
    .split(/\n+/) // Divise sur un ou plusieurs \n
    .map((p) => p.trim()) // Supprime les espaces en début/fin
    .filter((p) => p.length > 0) // Supprime les paragraphes vides
})

// Audio computed depuis le store
const isPlaying = computed(() => audioStore.isPlacePlayingAudio(props.place.id))
const isLoading = computed(() => audioStore.isPlaceAudioLoading(props.place.id))
const error = computed(() => audioStore.error)
const hasBeenPlayed = computed(() => audioStore.hasPlaceBeenPlayed(props.place.id))

// États de prétéléchargement
const downloadState = computed(() => {
  if (!placeContent.value.audioFile) return 'none'
  return audioStore.getDownloadState(placeContent.value.audioFile)
})

// Méthodes
function closePopup() {
  emit('close')
}

function onImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

async function playAudio() {
  if (placeContent.value.audioFile) {
    await audioStore.playAudio(props.place.id, placeContent.value.audioFile)
  }
}

/*
function showDetails() {
  emit('showDetails', props.place)
}
  */
</script>

<style scoped>
/* Container principal plein écran */
.place-fullscreen {
  width: 100%;
  height: 100%;
  display: flex;
  font-family: var(--font-family);
  background: var(--color-white);
  position: relative;
}

/* Bouton de fermeture */
.close-button {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.2);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  z-index: 1000;
  transition: all var(--transition-fast);
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

/* Image section */
.place-image-section {
  flex: 1;
  background: var(--color-background-light);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
}

.place-image-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform var(--transition-normal);
}

.place-image-section:hover img {
  transform: scale(1.02);
}

/* Section contenu */
.place-content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: transparent;
  overflow: hidden;
  margin-top: -24px; /* Remonte sur l'image pour montrer l'arrondi */
  z-index: 2; /* Au-dessus de l'image */
  border-radius: 24px 24px 0 0;
  box-shadow: 0 -8px 16px rgba(0, 0, 0, 0.1);
}

/* Zone de texte avec arrondi */
.place-text-area {
  flex: 1;
  padding: 48px 40px;
  cursor: pointer;
  overflow-y: auto;
  position: relative;
  background: var(--color-white);
  border-radius: 24px 24px 0 0;
}

.place-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 24px 0;
  line-height: 1.2;
}

.place-description {
  font-size: 1.2rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin: 0 0 24px 0;
}

.place-description p {
  margin: 0 0 1.2rem 0;
}

.place-description p:last-child {
  margin-bottom: 0;
}

.place-read-more {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 1rem;
  cursor: pointer;
  padding: 8px 0;
  text-decoration: underline;
  transition: color var(--transition-fast);
}

.place-read-more:hover {
  color: var(--color-primary-dark);
}

/* Contrôles audio minimalistes */
.place-audio-controls {
  background: var(--color-background-light);
  backdrop-filter: blur(10px);
  padding: 24px 40px;
  border-radius: 0 0 24px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: left;
}

.audio-control-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.audio-play-btn-minimal {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--color-warm);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 1rem;
}

.audio-play-btn-minimal:hover:not(:disabled) {
  background: var(--color-secondary);
  transform: scale(1.05);
}

.audio-play-btn-minimal:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.audio-label {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

/* Erreur */
.place-error {
  position: absolute;
  bottom: 24px;
  left: 40px;
  right: 40px;
  padding: 16px;
  background: var(--color-background-light);
  border: 1px solid var(--color-danger);
  border-radius: 8px;
  color: var(--color-danger);
  font-size: 0.9rem;
  text-align: center;
}

.place-error p {
  margin: 0;
}

/* Responsive pour mobile */
@media screen and (max-width: 768px) {
  .place-fullscreen {
    flex-direction: column;
  }

  .close-button {
    top: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }

  .place-image-section {
    flex: 0 0 40vh;
    min-height: 250px;
  }

  .place-content-section {
    flex: 1;
    overflow: auto;
    margin-top: -16px; /* Remonte moins sur mobile */
    border-radius: 16px 16px 0 0;
  }

  .place-text-area {
    padding: 32px 24px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    border-radius: 16px 16px 0 0;
  }

  .place-title {
    font-size: 2rem;
  }

  .place-description {
    font-size: 1.1rem;
  }

  .place-description p {
    margin: 0 0 1rem 0;
  }

  .place-audio-controls {
    padding: 16px 24px;
    flex-shrink: 0;
  }

  .place-error {
    left: 24px;
    right: 24px;
  }
}

@media screen and (max-width: 480px) {
  .place-image-section {
    flex: 0 0 35vh;
    min-height: 200px;
  }

  .place-content-section {
    margin-top: -12px; /* Encore moins sur très petits écrans */
  }

  .place-text-area {
    padding: 24px 20px;
  }

  .place-title {
    font-size: 1.8rem;
  }

  .place-description {
    font-size: 1rem;
  }

  .place-description p {
    margin: 0 0 0.8rem 0;
  }

  .place-audio-controls {
    padding: 12px 20px;
  }
}

/* Animation de pulsation pour le bouton audio non joué */
.audio-button-container {
  position: relative;
  display: inline-block;
}

.has-pulse-animation {
  position: relative;
}

.has-pulse-animation::before,
.has-pulse-animation::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border: 2px solid var(--color-primary);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  pointer-events: none;
}

.has-pulse-animation::before {
  animation: pulse-ring 2s ease-out infinite;
}

.has-pulse-animation::after {
  animation: pulse-ring 2s ease-out infinite 1s;
}

@keyframes pulse-ring {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

/* Indicateurs de prétéléchargement */
.download-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.download-indicator.downloading {
  background: orange;
  color: white;
}

.download-indicator.downloaded {
  background: green;
  color: white;
}

/* Style pour le bouton en cours de téléchargement */
.audio-play-btn-minimal:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.audio-play-btn-minimal .fa-circle-notch {
  color: #ffc107;
}
</style>
