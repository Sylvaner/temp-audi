<template>
  <div class="places-list" :class="{ 'is-open': isOpen }">
    <!-- Bouton pour ouvrir/fermer la liste -->
    <button
      class="button is-rounded is-normal is-autumn-primary"
      @click="toggleList"
      :title="isOpen ? 'Fermer la liste' : 'Voir les lieux'"
    >
      <span class="icon">
        <i class="fas" :class="isOpen ? 'fa-times' : 'fa-list'"></i>
      </span>
    </button>

    <!-- Liste des lieux -->
    <div class="places-panel" v-show="isOpen">
      <div class="places-header">
        <h3 class="title is-5">{{ t('map.places.title') }}</h3>
        <div class="places-settings">
          <button
            class="button is-small"
            :class="{
              'is-autumn-success': geolocationStore.moveToUserLocation,
              'is-autumn-light': !geolocationStore.moveToUserLocation,
            }"
            @click="toggleAutoCenter"
            :title="
              geolocationStore.moveToUserLocation
                ? t('map.settings.autoCenterEnabled')
                : t('map.settings.autoCenterDisabled')
            "
          >
            <span class="icon is-small">
              <i
                class="fas"
                :class="geolocationStore.moveToUserLocation ? 'fa-crosshairs' : 'fa-map'"
              ></i>
            </span>
          </button>
        </div>
      </div>

      <div class="places-content">
        <div v-for="place in places" :key="place.id" class="place-item" @click="goToPlace(place)">
          <div class="place-info">
            <h4 class="place-title">{{ getPlaceContent(place).title }}</h4>
            <p class="place-description">{{ getPlaceContent(place).description }}</p>
          </div>
          <div class="place-actions">
            <span
              class="icon"
              :class="
                getDownloadState(place) === 'downloading' ? 'has-text-warning' : 'has-text-primary'
              "
            >
              <i
                v-if="getDownloadState(place) === 'downloading'"
                class="fas fa-circle-notch fa-spin"
              ></i>
              <i v-else-if="getDownloadState(place) === 'downloaded'" class="fas fa-volume-up"></i>
              <i v-else class="fas fa-map-marker-alt"></i>
            </span>
          </div>
        </div>

        <div v-if="places.length === 0" class="has-text-centered has-text-grey">
          {{ t('map.places.empty') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/stores/language'
import { useGeolocationStore } from '@/stores/geolocation'
import { useAudioStore } from '@/stores/audio'
import type { Position } from '@/types'
import data from '@/data/data.json'

// Types locaux
interface Place {
  id: string
  order?: number // Ordre d'affichage des lieux
  latitude: number
  longitude: number
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

// Composables
const { t } = useI18n()
const languageStore = useLanguageStore()
const geolocationStore = useGeolocationStore()
const audioStore = useAudioStore()

// État local
const isOpen = ref(false)

// Données
const places = computed(() => {
  const placesArray = data.places as Place[]
  // Trier par ordre croissant (si order n'existe pas, utiliser l'index comme fallback)
  return placesArray.slice().sort((a, b) => (a.order || 0) - (b.order || 0))
})

// Émissions
const emit = defineEmits<{
  goToPlace: [position: Position]
}>()

// Méthodes
function toggleList() {
  isOpen.value = !isOpen.value
}

function getPlaceContent(place: Place) {
  const lang = languageStore.currentLanguage?.code || 'fr'
  return place.content[lang] || place.content['fr']
}

function goToPlace(place: Place) {
  const position: Position = {
    latitude: place.latitude,
    longitude: place.longitude,
  }
  emit('goToPlace', position)
  isOpen.value = false // Fermer la liste après sélection
}

function toggleAutoCenter() {
  geolocationStore.toggleMoveToUserLocation()
}

function getDownloadState(place: Place) {
  const placeContent = getPlaceContent(place)
  if (!placeContent.audioFile) return 'none'
  return audioStore.getDownloadState(placeContent.audioFile)
}
</script>

<style scoped>
.places-list {
  position: relative;
}

/* Style uniforme pour les boutons de contrôle */
.button.is-rounded {
  box-shadow: var(--shadow-light);
  transition: all var(--transition-normal);
}

.button.is-rounded:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-medium);
}

.places-panel {
  position: absolute;
  top: 3rem;
  right: 0;
  width: 320px;
  max-height: 400px;
  background: var(--color-surface);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-large);
  overflow: hidden;
  z-index: var(--z-ui);
}

.places-header {
  padding: 1rem;
  background: var(--color-background-light);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.places-header .title {
  margin-bottom: 0;
  flex: 1;
}

.places-settings {
  display: flex;
  gap: 0.5rem;
}

.places-content {
  max-height: 320px;
  overflow-y: auto;
}

.place-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: background-color var(--transition-normal);
}

.place-item:hover {
  background-color: var(--color-background-light);
}

.place-item:last-child {
  border-bottom: none;
}

.place-info {
  flex: 1;
  min-width: 0;
}

.place-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--color-text);
  line-height: 1.3;
}

.place-description {
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.place-actions {
  margin-left: 0.75rem;
  display: flex;
  align-items: center;
}

/* Responsive */
@media screen and (max-width: 768px) {
  .places-panel {
    width: 280px;
    right: -1rem;
  }
}

/* Scrollbar personnalisée */
.places-content::-webkit-scrollbar {
  width: 4px;
}

.places-content::-webkit-scrollbar-track {
  background: var(--color-scrollbar-track);
}

.places-content::-webkit-scrollbar-thumb {
  background: var(--color-scrollbar-thumb);
  border-radius: var(--border-radius-small);
}

.places-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-scrollbar-thumb-hover);
}

/* Classes automne personnalisées */
.button.is-autumn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
}

.button.is-autumn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.button.is-autumn-success {
  background-color: var(--color-accent);
  color: var(--color-white);
  border: none;
}

.button.is-autumn-success:hover:not(:disabled) {
  background-color: var(--color-deep);
}

.button.is-autumn-light {
  background-color: var(--color-background-light);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.button.is-autumn-light:hover:not(:disabled) {
  background-color: var(--color-background);
  border-color: var(--color-primary);
}

/* Styles pour les états de téléchargement */
.place-actions .icon {
  transition: color 0.3s ease;
}

.place-actions .has-text-warning {
  color: #ffc107 !important;
}

.place-actions .fa-circle-notch {
  animation: fa-spin 1s infinite linear;
}
</style>
