<template>
  <div class="language-debug" v-if="showDebug">
    <h4>Détection de langue (Debug)</h4>
    <p><strong>Langues du navigateur :</strong> {{ browserLanguages.join(', ') }}</p>
    <p><strong>Langue détectée :</strong> {{ detectedLanguage }}</p>
    <p><strong>Langue actuelle :</strong> {{ currentLanguage }}</p>
    <p><strong>Langues disponibles :</strong> {{ availableLanguages.join(', ') }}</p>
    <p><strong>Langue par défaut :</strong> {{ defaultLanguage }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLanguageStore } from '@/stores/language'
import { 
  detectBrowserLanguage, 
  getDefaultLanguage, 
  getAppAvailableLanguages 
} from '@/utils/language'

interface Props {
  showDebug?: boolean
}

withDefaults(defineProps<Props>(), {
  showDebug: false
})

const languageStore = useLanguageStore()

const browserLanguages = computed(() => navigator.languages || [navigator.language])
const detectedLanguage = computed(() => detectBrowserLanguage())
const currentLanguage = computed(() => languageStore.currentLocale)
const availableLanguages = computed(() => getAppAvailableLanguages())
const defaultLanguage = computed(() => getDefaultLanguage())
</script>

<style scoped>
.language-debug {
  background: #f5f5f5;
  border: 1px solid #ddd;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  font-size: 0.9rem;
}

.language-debug h4 {
  margin: 0 0 0.5rem 0;
  color: #666;
}

.language-debug p {
  margin: 0.25rem 0;
}
</style>
