<template>
  <div class="dropdown" :class="{ 'is-active': isOpen }">
    <div class="dropdown-trigger">
      <button class="button" aria-haspopup="true" :aria-expanded="isOpen" @click="toggle">
        <span class="flag-emoji">{{ currentLanguage?.flag }}</span>
        <span>{{ currentLanguage?.name }}</span>
        <span class="icon is-small">
          <i class="fas fa-angle-down" aria-hidden="true"></i>
        </span>
      </button>
    </div>
    <div class="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <a
          v-for="language in availableLanguages"
          :key="language.code"
          href="#"
          class="dropdown-item"
          :class="{ 'is-active': language.code === currentLocale }"
          @click.prevent="selectLanguage(language.code)"
        >
          <span class="flag-emoji">{{ language.flag }}</span>
          <span>{{ language.name }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useLanguageStore } from '@/stores/language'

// Store
const languageStore = useLanguageStore()

// État local
const isOpen = ref(false)

// Computed properties pour s'assurer de la réactivité
const currentLocale = computed(() => languageStore.currentLocale)
const availableLanguages = computed(() => languageStore.availableLanguages)
const currentLanguage = computed(() => languageStore.currentLanguage)

// Fermer le dropdown quand la langue change
watch(currentLocale, () => {
  isOpen.value = false
})

// Méthodes
function toggle() {
  isOpen.value = !isOpen.value
}

function selectLanguage(languageCode: string) {
  languageStore.setLanguage(languageCode)
  isOpen.value = false
}

// Ferme le dropdown si on clique ailleurs
function handleClickOutside(event: Event) {
  const target = event.target as HTMLElement
  if (!target.closest('.dropdown')) {
    isOpen.value = false
  }
}

// Ajoute l'écouteur d'événement quand le composant est monté
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown {
  position: relative;
  z-index: var(--z-overlay);
}

.dropdown-trigger .button {
  background-color: transparent;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dropdown-trigger .button:hover {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.flag-emoji {
  font-size: 1.2em;
  display: inline-block;
  min-width: 1.5em;
  text-align: center;
  line-height: 1;
}

.dropdown-menu {
  position: absolute !important;
  z-index: calc(var(--z-overlay) + 1) !important; /* Au-dessus des autres overlays */
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-medium);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
}

.dropdown-item .flag-emoji {
  font-size: 1.2em;
  display: inline-block;
  min-width: 1.5em;
  text-align: center;
}

.dropdown-item.is-active {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.dropdown-item:hover {
  background-color: var(--color-background-hover);
}

.dropdown-item.is-active:hover {
  background-color: var(--color-primary);
}
</style>
