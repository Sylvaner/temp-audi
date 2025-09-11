<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <!-- Header -->
      <header class="modal-card-head">
        <!-- Indicateur de progression -->
        <div class="container">
          <!-- Progress bar Bulma -->
          <progress class="progress is-primary" :value="progressPercentage" max="100">
            {{ progressPercentage }}%
          </progress>
        </div>
      </header>

      <!-- Contenu des étapes -->
      <section class="modal-card-body">
        <div class="container has-text-centered">
          <!-- Étape 1 -->
          <div v-show="currentStep === 1" class="content">
            <div class="has-text-primary mb-5">
              <span class="icon is-large user-location-icon">
                <i :class="`fas ${icons.userLocation} fa-3x`"></i>
              </span>
            </div>
            <h2 class="title is-4">{{ $t('mapIntro.step1.title') }}</h2>
            <p class="subtitle is-6 has-text-grey">{{ $t('mapIntro.step1.description') }}</p>
          </div>

          <!-- Étape 2 -->
          <div v-show="currentStep === 2" class="content">
            <div class="has-text-primary mb-5">
              <span class="icon is-large place-location-icon">
                <i :class="`fas ${icons.place} fa-3x`"></i>
              </span>
            </div>
            <h2 class="title is-4">{{ $t('mapIntro.step2.title') }}</h2>
            <p class="subtitle is-6 has-text-grey">{{ $t('mapIntro.step2.description') }}</p>
          </div>

          <!-- Étape 3 -->
          <div v-show="currentStep === 3" class="content">
            <div class="has-text-primary mb-5">
              <div class="audio-button-container">
                <span class="icon is-large play-button has-pulse-animation">
                  <i class="fas fa-play fa-3x"></i>
                </span>
              </div>
            </div>
            <h2 class="title is-4">{{ $t('mapIntro.step3.title') }}</h2>
            <p class="subtitle is-6 has-text-grey">{{ $t('mapIntro.step3.description') }}</p>
          </div>
        </div>
      </section>

      <!-- Footer avec boutons -->
      <footer class="modal-card-foot">
        <div class="buttons">
          <button
            :disabled="currentStep === 1"
            class="button"
            :class="{ 'is-light': currentStep === 1 }"
            @click="previousStep"
          >
            <span class="icon">
              <i class="fas fa-chevron-left"></i>
            </span>
            <span>{{ $t('mapIntro.previousButton') }}</span>
          </button>

          <button v-if="currentStep < 3" class="button is-primary" @click="nextStep">
            <span>{{ $t('mapIntro.nextButton') }}</span>
            <span class="icon">
              <i class="fas fa-chevron-right"></i>
            </span>
          </button>

          <button v-if="currentStep === 3" class="button is-primary" @click="startExploring">
            <span class="icon">
              <i class="fas fa-map"></i>
            </span>
            <span>{{ $t('mapIntro.visitButton') }}</span>
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfig } from '@/composables/useConfig'

// Composables
const router = useRouter()
const { icons } = useConfig()

// État local
const currentStep = ref(1)

// Computed
const progressPercentage = computed(() => {
  return ((currentStep.value - 1) / 2) * 100
})

// Méthodes
const nextStep = () => {
  if (currentStep.value < 3) {
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

  // Naviguer vers la carte
  router.push('/map')
}
</script>

<style scoped>
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
  .steps {
    min-width: 150px;
  }
  .field.is-grouped {
    flex-direction: column;
  }
  .field.is-grouped .control {
    width: 100%;
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
</style>
