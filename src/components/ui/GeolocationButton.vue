<template>
  <button
    class="button is-rounded"
    :class="buttonClass"
    :disabled="
      !geolocationStore.isLocationAvailable || geolocationStore.permissionStatus === 'requesting'
    "
    @click="handleLocationClick"
    :title="buttonTitle"
  >
    <span class="icon">
      <i class="fas" :class="iconClass"></i>
    </span>
    <span v-if="showText" class="ml-1">{{ buttonText }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGeolocationStore } from '@/stores/geolocation'
import { useI18n } from 'vue-i18n'

// Props
interface Props {
  showText?: boolean
  size?: 'small' | 'normal' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  showText: false,
  size: 'normal', // Taille normale par défaut
})

// Composables
const geolocationStore = useGeolocationStore()
const { t } = useI18n()

// Émissions
const emit = defineEmits<{
  requestPermission: []
}>()

// Computed
const buttonClass = computed(() => {
  const classes = [`is-${props.size}`]

  switch (geolocationStore.permissionStatus) {
    case 'granted':
      classes.push('is-theme-success')
      break
    case 'denied':
      classes.push('is-theme-warning')
      break
    case 'requesting':
      classes.push('is-loading', 'is-theme-info')
      break
    default:
      classes.push('is-theme-primary')
  }

  return classes
})

const iconClass = computed(() => {
  switch (geolocationStore.permissionStatus) {
    case 'granted':
      return 'fa-location-crosshairs'
    case 'denied':
      return 'fa-location-slash'
    case 'requesting':
      return 'fa-spinner fa-spin'
    default:
      return 'fa-location-crosshairs'
  }
})

const buttonText = computed(() => {
  switch (geolocationStore.permissionStatus) {
    case 'granted':
      return t('map.centerOnUser')
    case 'denied':
      return t('geolocation.denied.retry')
    case 'requesting':
      return t('common.loading')
    default:
      return t('map.centerOnUser')
  }
})

const buttonTitle = computed(() => {
  if (!geolocationStore.isLocationAvailable) {
    return 'Géolocalisation non disponible'
  }

  switch (geolocationStore.permissionStatus) {
    case 'granted':
      return 'Centrer la carte sur votre position'
    case 'denied':
      return 'Réessayer la géolocalisation'
    case 'requesting':
      return 'Demande de permission en cours...'
    default:
      return "Demander l'accès à votre position"
  }
})

// Méthodes
function handleLocationClick() {
  if (
    geolocationStore.permissionStatus === 'unknown' ||
    geolocationStore.permissionStatus === 'denied'
  ) {
    emit('requestPermission')
  }
  // Si déjà autorisé, on peut centrer directement la carte (géré par le composant parent)
}
</script>

<style scoped>
/* Style uniforme pour les boutons de contrôle */
.button.is-rounded {
  box-shadow: var(--shadow-light);
  transition: all var(--transition-normal);
  position: relative;
  z-index: var(--z-ui);
  border: none;
}

.button.is-rounded:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-medium);
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Classes automne personnalisées */
.button.is-theme-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.button.is-theme-primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.button.is-theme-success {
  background-color: var(--color-accent);
  color: var(--color-white);
}

.button.is-theme-success:hover:not(:disabled) {
  background-color: var(--color-deep);
}

.button.is-theme-warning {
  background-color: var(--color-warm);
  color: var(--color-white);
}

.button.is-theme-warning:hover:not(:disabled) {
  background-color: var(--color-secondary);
}

.button.is-theme-info {
  background-color: var(--color-secondary);
  color: var(--color-white);
}

.button.is-theme-info:hover:not(:disabled) {
  background-color: var(--color-accent);
}
</style>
