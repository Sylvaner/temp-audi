<template>
  <div class="language-tester">
    <h3>Test de détection de langue</h3>
    
    <div class="test-section">
      <h4>Simulation de langues de navigateur</h4>
      <button 
        v-for="testCase in testCases" 
        :key="testCase.name"
        @click="simulateLanguage(testCase)"
        class="test-button"
      >
        {{ testCase.name }}
      </button>
    </div>

    <div class="test-section">
      <h4>Actions</h4>
      <button @click="resetToDefault" class="test-button">
        Réinitialiser à la langue par défaut
      </button>
      <button @click="detectAndSet" class="test-button">
        Re-détecter la langue du navigateur
      </button>
      <button @click="clearStorage" class="test-button">
        Vider le localStorage
      </button>
    </div>

    <div class="test-results">
      <p><strong>Langue actuelle :</strong> {{ currentLanguage }}</p>
      <p><strong>Langue stockée :</strong> {{ storedLanguage || 'Aucune' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLanguageStore } from '@/stores/language'
import { detectBrowserLanguage, getDefaultLanguage } from '@/utils/language'

const languageStore = useLanguageStore()

const currentLanguage = computed(() => languageStore.currentLocale)
const storedLanguage = ref(localStorage.getItem('preferred-language'))

const testCases = [
  { name: 'Français (fr)', languages: ['fr'] },
  { name: 'Anglais (en)', languages: ['en'] },
  { name: 'Espagnol (es)', languages: ['es'] },
  { name: 'Français France (fr-FR)', languages: ['fr-FR'] },
  { name: 'Anglais US (en-US)', languages: ['en-US'] },
  { name: 'Allemand + Anglais', languages: ['de', 'en'] },
  { name: 'Japonais + Français', languages: ['ja', 'fr'] },
]

function simulateLanguage(testCase: typeof testCases[0]) {
  // Simulation de navigator.languages (pour le test uniquement)
  Object.defineProperty(navigator, 'languages', {
    value: testCase.languages,
    configurable: true
  })
  
  // Re-détection
  const detected = detectBrowserLanguage()
  languageStore.setLanguage(detected)
  
  console.log(`Test: ${testCase.name}`)
  console.log(`Langues simulées: ${testCase.languages.join(', ')}`)
  console.log(`Langue détectée: ${detected}`)
}

function resetToDefault() {
  languageStore.setLanguage(getDefaultLanguage())
}

function detectAndSet() {
  const detected = detectBrowserLanguage()
  languageStore.setLanguage(detected)
}

function clearStorage() {
  localStorage.removeItem('preferred-language')
  storedLanguage.value = null
  // Re-initialiser la langue
  languageStore.initializeLanguage()
}

// Mettre à jour storedLanguage quand elle change
function updateStoredLanguage() {
  storedLanguage.value = localStorage.getItem('preferred-language')
}

// Observer les changements
setInterval(updateStoredLanguage, 1000)
</script>

<style scoped>
.language-tester {
  background: #f0f8ff;
  border: 2px solid #4a90e2;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
}

.test-section {
  margin: 1rem 0;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;
}

.test-section:last-child {
  border-bottom: none;
}

.test-button {
  background: #4a90e2;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.test-button:hover {
  background: #357abd;
}

.test-results {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
}

h3, h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}
</style>
