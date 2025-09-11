<template>
  <div id="app">
    <AppNavigation />
    <main class="main-content" :class="{ scrollable: isScrollableRoute }">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppNavigation from '@/components/navigation/AppNavigation.vue'
import { useLanguageStore } from '@/stores/language'
import { useConfig } from '@/composables/useConfig'

// Initialisation de la langue
const languageStore = useLanguageStore()
const { siteName } = useConfig()
const route = useRoute()

// Routes qui ont besoin de scroll
const isScrollableRoute = computed(() => {
  return ['about'].includes(route.name as string)
})

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
  overflow: hidden;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.main-content.scrollable {
  overflow-y: auto;
  overflow-x: hidden;
}

/* Responsive padding pour bottom nav mobile */
@media screen and (max-width: 768px) {
  .main-content {
    padding-bottom: 4rem;
  }
}
</style>
