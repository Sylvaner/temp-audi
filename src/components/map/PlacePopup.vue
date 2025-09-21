<template>
  <div class="place-popup is-fullheight-viewport">
    <button class="delete is-large" @click="closePopup"></button>

    <div v-if="place.imageFile" class="image-section" @click="closePopup">
      <img :src="`/images/${place.imageFile}`" :alt="placeContent.title" @error="onImageError" />
    </div>

    <div class="content-section">
      <div class="content-area has-custom-scrollbar" @click="closePopup">
        <h1 class="title is-3">{{ placeContent.title }}</h1>
        <div class="content">
          <p v-for="(paragraph, index) in textParagraphs" :key="index">
            {{ paragraph }}
          </p>
        </div>
      </div>

      <div v-if="placeContent.audioFile" class="audio-controls">
        <div class="media media-centered">
          <div class="media-left">
            <button
              class="button is-rounded is-primary"
              :class="{
                'is-loading': isLoading,
                'is-warning': isPlaying,
                'has-pulse-animation': !hasBeenPlayed && !isPlaying,
              }"
              @click="playAudio"
              :disabled="isLoading"
            >
              <span class="icon">
                <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
              </span>
            </button>
          </div>
          <div class="media-content">
            <p class="has-text-weight-medium">
              {{ isPlaying ? t('audio.pause') : t('audio.listen') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="notification is-danger">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/stores/language'
import { useAudioStore } from '@/stores/audio'
import { getDefaultLanguage } from '@/utils/language'
import type { Place } from '@/types'

interface Props {
  place: Place
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()
const languageStore = useLanguageStore()
const audioStore = useAudioStore()

const placeContent = computed(() => {
  const lang = languageStore.currentLanguage?.code || getDefaultLanguage()
  return props.place.content[lang] || props.place.content[getDefaultLanguage()]
})

const textParagraphs = computed(() => {
  if (!placeContent.value?.text) return []
  return placeContent.value.text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
})

const isPlaying = computed(() => audioStore.isPlacePlayingAudio(props.place.id))
const isLoading = computed(() => audioStore.isPlaceAudioLoading(props.place.id))
const error = computed(() => audioStore.error)
const hasBeenPlayed = computed(() => audioStore.hasPlaceBeenPlayed(props.place.id))

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
</script>

<style scoped>
.place-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: var(--z-modal);
  display: flex;
  flex-direction: column;
  width: 100vw;
  overflow: hidden; /* Empêche le scroll sur le conteneur principal */
}

.delete {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: calc(var(--z-modal) + 1);
}

.image-section {
  flex: 1;
  overflow: hidden;
  cursor: pointer;
}

.image-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* Important pour le flex shrink */
}

.content-area {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  cursor: pointer;
  min-height: 0; /* Permet au contenu de se rétrécir */
}

/* Scrollbar utilise maintenant la classe utilitaire has-custom-scrollbar */

.audio-controls {
  flex: 0 0 auto; /* Ne jamais shrink, toujours visible */
  padding: 1.5rem;
  background: var(--color-background-light);
  border-top: 1px solid var(--color-border-light);
}

/* Alignement centré géré par la classe utilitaire media-centered */

/* Animation pulse utilise maintenant la classe utilitaire has-pulse-animation */

/* Mobile - empiler verticalement */
@media screen and (max-width: 768px) {
  .place-popup {
    flex-direction: column;
    /* Assure que le popup prend tout l'espace disponible */
    height: 100vh;
    height: 100dvh;
    min-height: 100vh;
    min-height: 100dvh;
    overflow: hidden;
  }

  .image-section {
    flex: 0 0 40vh;
    min-height: 200px;
    max-height: 50vh; /* Évite que l'image prenne trop de place */
  }

  .content-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0; /* Important pour permettre le flex shrink */
  }

  .content-area {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch; /* Smooth scroll sur iOS */
    min-height: 0; /* Permet au contenu de se rétrécir */
  }

  .audio-controls {
    flex: 0 0 auto; /* Ne pas shrink */
    padding: 1rem 1.5rem;
    background: var(--color-background-light);
    border-top: 1px solid var(--color-border-light);
  }
}

/* Desktop - côte à côte */
@media screen and (min-width: 769px) {
  .place-popup {
    flex-direction: row;
  }

  .image-section,
  .content-section {
    flex: 1;
  }
}
</style>
