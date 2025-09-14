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

/* Bulma overrides pour le thème automne */
:root {
  /* Couleurs principales Bulma avec notre palette automne */
  --bulma-primary-h: 44deg;
  --bulma-primary-s: 47%;
  --bulma-primary-l: 56%;
  --bulma-primary: var(--color-primary);

  --bulma-link-h: 22deg;
  --bulma-link-s: 57%;
  --bulma-link-l: 46%;
  --bulma-link: var(--color-secondary);

  --bulma-info-h: 44deg;
  --bulma-info-s: 47%;
  --bulma-info-l: 56%;
  --bulma-info: var(--color-primary);

  --bulma-warning-h: 24deg;
  --bulma-warning-s: 75%;
  --bulma-warning-l: 47%;
  --bulma-warning: var(--color-warm);

  --bulma-danger-h: 354deg;
  --bulma-danger-s: 40%;
  --bulma-danger-l: 31%;
  --bulma-danger: var(--color-deep);

  /* Couleurs de fond */
  --bulma-body-background-color: var(--color-background);
  --bulma-body-color: var(--color-text);

  /* Couleurs des composants */
  --bulma-hero-body-padding-small: 1.5rem 0;
  --bulma-hero-body-padding-medium: 9rem 4.5rem;

  /* Navbar */
  --bulma-navbar-background-color: var(--color-surface);
  --bulma-navbar-item-color: var(--color-text);
  --bulma-navbar-item-hover-background-color: var(--color-background-hover);
  --bulma-navbar-item-hover-color: var(--color-primary);

  /* Boutons */
  --bulma-button-border-color: var(--color-border);
  --bulma-button-color: var(--color-text);

  /* Modales */
  --bulma-modal-background-background-color: rgba(47, 27, 20, 0.4);

  /* Cards */
  --bulma-card-background-color: var(--color-surface);
  --bulma-card-shadow: var(--shadow-medium);

  /* Section */
  --bulma-section-padding: 3rem 1.5rem;

  /* Titre et texte */
  --bulma-title-color: var(--color-text);
  --bulma-subtitle-color: var(--color-text-secondary);

  /* Progress bar */
  --bulma-progress-bar-background-color: var(--color-background-muted);

  /* Notification */
  --bulma-notification-background-color: var(--color-surface);
}

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

/* Scrollbar personnalisée avec thème automne */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-scrollbar-track);
}

::-webkit-scrollbar-thumb {
  background: var(--color-scrollbar-thumb);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-scrollbar-thumb-hover);
}

/* Firefox scrollbar */
html {
  scrollbar-width: thin;
  scrollbar-color: var(--color-scrollbar-thumb) var(--color-scrollbar-track);
}

/* Responsive padding pour mobile avec navbar fixe */
@media screen and (max-width: 1023px) {
  .main-content {
    margin-top: 52px; /* Hauteur de la navbar fixe */
    min-height: calc(100vh - 52px);
  }
}

@media screen and (max-width: 768px) {
  .main-content {
    padding-bottom: 4rem;
  }
}
</style>
