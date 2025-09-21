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

const languageStore = useLanguageStore()
const { siteName } = useConfig()
const route = useRoute()

// Routes qui ont besoin de scroll
const isScrollableRoute = computed(() => {
  return ['about', 'map-intro'].includes(route.name as string)
})

// Traduction du titre de la page
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
@import '@/styles/global.css';
@import 'bulma/css/bulma.min.css';
@import '@fortawesome/fontawesome-free/css/all.min.css';

/* Améliorations générales du thème */
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

/* Responsive */
@media screen and (max-width: 1023px) {
  .main-content {
    margin-top: 52px;
    min-height: calc(100vh - 52px);
  }
}
</style>
