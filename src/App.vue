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
  return ['about', 'map-intro'].includes(route.name as string)
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
/* Imports doivent être en premier */
@import '@/styles/variables.css';
@import 'bulma/css/bulma.min.css';
@import '@fortawesome/fontawesome-free/css/all.min.css';

/* Les variables Bulma sont maintenant centralisées dans variables.css */

/* Améliorations générales du thème automne */
.hero.is-primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)) !important;
}

.hero.is-info {
  background: linear-gradient(135deg, var(--color-secondary), var(--color-warm)) !important;
}

/* Animations douces */
.button,
.card,
.notification {
  transition: all var(--transition-normal);
}

/* Amélioration des ombres */
.card {
  box-shadow: var(--shadow-medium) !important;
}

.card:hover {
  box-shadow: var(--shadow-large) !important;
  transform: translateY(-2px);
}

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

/* Scrollbar globale utilise maintenant la classe utilitaire */
html {
  scrollbar-width: thin;
  scrollbar-color: var(--color-scrollbar-thumb) var(--color-scrollbar-track);
}

html::-webkit-scrollbar {
  width: 8px;
}

html::-webkit-scrollbar-track {
  background: var(--color-scrollbar-track);
}

html::-webkit-scrollbar-thumb {
  background: var(--color-scrollbar-thumb);
  border-radius: var(--border-radius-small);
}

html::-webkit-scrollbar-thumb:hover {
  background: var(--color-scrollbar-thumb-hover);
}

/* Responsive utilise maintenant les classes utilitaires */
@media screen and (max-width: 1023px) {
  .main-content {
    margin-top: 52px;
    min-height: calc(100vh - 52px);
  }
}

@media screen and (max-width: 768px) {
  .main-content {
    padding-bottom: 4rem;
  }
}
</style>
