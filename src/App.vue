<template>
  <div id="app">
    <AppNavigation />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import AppNavigation from '@/components/navigation/AppNavigation.vue'
import { useLanguageStore } from '@/stores/language'
import { useConfig } from '@/composables/useConfig'

// Initialisation de la langue
const languageStore = useLanguageStore()
const { siteName } = useConfig()

// Mettre à jour le titre de la page
watch(
  siteName,
  (newSiteName) => {
    document.title = `${newSiteName} - Audio Guide`
  },
  { immediate: true },
)

onMounted(() => {
  languageStore.initializeLanguage()
})
</script>

<style>
/* Import Bulma CSS */
@import 'bulma/css/bulma.min.css';
/* Import Font Awesome */
@import '@fortawesome/fontawesome-free/css/all.min.css';

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  overflow: hidden;
}

/* Responsive padding pour bottom nav mobile */
@media screen and (max-width: 768px) {
  .main-content {
    padding-bottom: 4rem;
  }
}
</style>
