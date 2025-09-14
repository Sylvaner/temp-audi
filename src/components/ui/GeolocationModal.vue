<template>
  <div class="modal" :class="{ 'is-active': isVisible }">
    <div class="modal-background" @click="close"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <span class="icon">
            <i class="fas fa-map-marker-alt"></i>
          </span>
          {{ $t('geolocation.permission.title') }}
        </p>
        <button class="delete" aria-label="close" @click="close"></button>
      </header>

      <section class="modal-card-body">
        <div v-if="type === 'request'" class="content">
          <p>{{ $t('geolocation.permission.message') }}</p>
          <ul>
            <li>{{ $t('geolocation.permission.benefit1') }}</li>
            <li>{{ $t('geolocation.permission.benefit2') }}</li>
            <li>{{ $t('geolocation.permission.benefit3') }}</li>
          </ul>
          <p class="has-text-grey is-size-7">
            {{ $t('geolocation.permission.privacy') }}
          </p>
        </div>

        <div v-else-if="type === 'denied'" class="content">
          <div class="notification is-warning">
            <p class="title is-5">
              <span class="icon">
                <i class="fas fa-exclamation-triangle"></i>
              </span>
              {{ $t('geolocation.denied.title') }}
            </p>
            <p>{{ $t('geolocation.denied.message') }}</p>
          </div>

          <p>{{ $t('geolocation.denied.alternative') }}</p>

          <div class="box">
            <p class="subtitle is-6">{{ $t('geolocation.denied.howToEnable') }}</p>
            <ol>
              <li>{{ $t('geolocation.denied.step1') }}</li>
              <li>{{ $t('geolocation.denied.step2') }}</li>
              <li>{{ $t('geolocation.denied.step3') }}</li>
            </ol>
          </div>
        </div>
      </section>

      <footer class="modal-card-foot">
        <div v-if="type === 'request'" class="buttons">
          <button class="button is-primary" @click="allowGeolocation">
            <span class="icon">
              <i class="fas fa-check"></i>
            </span>
            <span>{{ $t('geolocation.permission.allow') }}</span>
          </button>
          <button class="button" @click="denyGeolocation">
            {{ $t('geolocation.permission.deny') }}
          </button>
        </div>

        <div v-else-if="type === 'denied'" class="buttons">
          <button class="button is-primary" @click="retryGeolocation">
            <span class="icon">
              <i class="fas fa-redo"></i>
            </span>
            <span>{{ $t('geolocation.denied.retry') }}</span>
          </button>
          <button class="button" @click="close">
            {{ $t('common.close') }}
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  isVisible: boolean
  type: 'request' | 'denied'
}

defineProps<Props>()

// Émissions
const emit = defineEmits<{
  close: []
  allow: []
  deny: []
  retry: []
}>()

// Méthodes
function close() {
  emit('close')
}

function allowGeolocation() {
  emit('allow')
}

function denyGeolocation() {
  emit('deny')
  close()
}

function retryGeolocation() {
  emit('retry')
}
</script>

<style scoped>
.modal {
  z-index: var(--z-modal);
}

.modal-card {
  max-width: 500px;
  margin: 0 auto;
  position: relative;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-large);
}

.modal-card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.box ol {
  margin-left: 1rem;
}

.box ol li {
  margin-bottom: 0.5rem;
}
</style>
