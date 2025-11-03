<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <div class="container">
          <progress class="progress is-primary" :value="progressPercentage" max="100">
            {{ progressPercentage }}%
          </progress>
        </div>
      </header>

      <section class="modal-card-body">
        <div class="container has-text-centered">
          <div v-show="currentStep === 1" class="content">
            <div class="language-selector-main mb-5">
              <LanguageSelector />
            </div>
            <h2 class="title is-4">{{ $t('mapIntro.language.title') }}</h2>
            <p class="subtitle is-6 has-text-grey mb-5">
              {{ $t('mapIntro.language.description') }}
            </p>
          </div>

          <div v-show="currentStep === 2" class="content">
            <div class="has-text-primary mb-5">
              <span class="icon is-large user-location-icon">
                <font-awesome-icon :icon="markerStyle.defaultUserLocationIcon?.replace('fa-', '') || 'person-walking'" size="3x" />
              </span>
            </div>
            <h2 class="title is-4">{{ $t('mapIntro.step1.title') }}</h2>
            <p class="subtitle is-6 has-text-grey">{{ $t('mapIntro.step1.description') }}</p>
          </div>

          <div v-show="currentStep === 3" class="content">
            <div class="has-text-primary mb-5">
              <span class="icon is-large place-location-icon">
                <font-awesome-icon :icon="markerStyle.defaultPlaceIcon?.replace('fa-', '') || 'monument'" size="3x" />
              </span>
            </div>
            <h2 class="title is-4">{{ $t('mapIntro.step2.title') }}</h2>
            <p class="subtitle is-6 has-text-grey">{{ $t('mapIntro.step2.description') }}</p>
          </div>
          <div v-show="currentStep === 4" class="content">
            <div class="has-text-primary mb-5">
              <div class="audio-volume-container">
                <div class="audio-button-container">
                  <span class="icon is-large play-button has-pulse-animation">
                    <font-awesome-icon icon="play" size="3x" />
                  </span>
                </div>
                <div class="volume-icons-container">
                  <span class="icon is-medium volume-icon">
                    <font-awesome-icon icon="volume-up" size="lg" />
                  </span>
                  <span class="icon is-medium headphones-icon">
                    <font-awesome-icon icon="headphones" size="lg" />
                  </span>
                </div>
              </div>
            </div>
            <h2 class="title is-4">{{ $t('mapIntro.step4.title') }}</h2>
            <p class="subtitle is-6 has-text-grey">{{ $t('mapIntro.step4.description') }}</p>
          </div>
        </div>
      </section>

      <footer class="modal-card-foot">
        <div class="buttons">
          <button
            :disabled="currentStep === 1"
            class="button"
            :class="{ 'is-light': currentStep === 1 }"
            @click="previousStep"
          >
            <span class="icon">
              <font-awesome-icon icon="chevron-left" />
            </span>
            <span>{{ $t('mapIntro.previousButton') }}</span>
          </button>

          <button v-if="currentStep < 4" class="button is-primary" @click="nextStep">
            <span>{{ $t('mapIntro.nextButton') }}</span>
            <span class="icon">
              <font-awesome-icon icon="chevron-right" />
            </span>
          </button>

          <button v-if="currentStep === 4" class="button is-primary" @click="startExploring">
            <span class="icon">
              <font-awesome-icon icon="map" />
            </span>
            <span>{{ $t('mapIntro.visitButton') }}</span>
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConfig } from '@/composables/useConfig'
import LanguageSelector from '@/components/ui/LanguageSelector.vue'

const router = useRouter()
const { markerStyle } = useConfig()

const currentStep = ref(1)

// Assurer que la vue démarre en haut
onMounted(() => {
  window.scrollTo(0, 0)
})

const progressPercentage = computed(() => {
  return ((currentStep.value - 1) / 3) * 100
})

const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const startExploring = () => {
  // Marquer l'intro comme vue et ne plus l'afficher
  localStorage.setItem('mapIntroSeen', 'true')
  localStorage.setItem('mapIntroDontShow', 'true')
  router.push('/map')
}
</script>

<style scoped>
/* Modal plein écran avec scroll */
.modal {
  overflow-y: auto;
  overflow-x: hidden;
}

/* Modal & animations avec thème automne */
.modal-card {
  max-width: 600px;
  animation: modalSlideIn 0.3s ease-out;
  box-shadow: var(--shadow-heavy);
}

.modal-card-head {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: var(--color-white);
}

.modal-card-foot {
  justify-content: center;
  background-color: var(--color-background-light);
  border-top: 1px solid var(--color-border);
}

footer .button.is-primary {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

footer .button.is-primary:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-medium);
}

.progress.is-primary {
  --bulma-progress-value-background-color: var(--color-secondary);
  background-color: var(--color-background-muted);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.content {
  animation: slideIn 0.3s ease-out;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .modal-card {
    width: 95vw;
  }
}

.user-location-icon {
  background: var(--color-user);
}

.place-location-icon {
  background: var(--color-primary);
}

.user-location-icon,
.place-location-icon {
  border: 3px solid white;
  border-radius: 50%;
  height: 5rem;
  width: 5rem;
  box-shadow: var(--shadow-medium);
  color: var(--color-white);
}

/* Style principal pour le sélecteur de langue en position d'icône */
.language-selector-main {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 5rem;
}

.language-selector-main :deep(.dropdown) {
  display: flex;
  justify-content: center;
}

.language-selector-main :deep(.button) {
  background: linear-gradient(135deg, var(--color-secondary), var(--color-primary));
  border: 3px solid white;
  color: var(--color-white);
  font-size: 1.25rem;
  font-weight: 600;
  padding: 1rem 2rem;
  min-height: 4rem;
  border-radius: 2rem;
  box-shadow: var(--shadow-medium);
  transition: all 0.3s ease;
}

.language-selector-main :deep(.button:hover) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-large);
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
}

.language-selector-main :deep(.button .flag-emoji) {
  font-size: 1.5rem;
  margin-right: 0.75rem;
}

/* S'assurer que le dropdown s'affiche au-dessus de tout */
.language-selector-main :deep(.dropdown-menu) {
  z-index: 9999 !important;
  margin-top: 0.5rem;
  border-radius: 1rem;
  box-shadow: var(--shadow-heavy);
  border: 2px solid var(--color-primary);
}

.language-selector-main :deep(.dropdown-content) {
  border-radius: 1rem;
  overflow: hidden;
}

.language-selector-main :deep(.dropdown-item) {
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  transition: all 0.2s ease;
}

.language-selector-main :deep(.dropdown-item:hover) {
  background-color: var(--color-primary);
  color: var(--color-white);
  transform: translateX(4px);
}

.audio-button-container {
  position: relative;
  display: inline-block;
}

.play-button {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  border: none;
  background: var(--color-warm);
  color: var(--color-white);
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

.audio-volume-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.volume-icons-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
}

.volume-icon,
.headphones-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: var(--shadow-medium);
  color: var(--color-white);
  background: var(--color-secondary);
}
</style>
