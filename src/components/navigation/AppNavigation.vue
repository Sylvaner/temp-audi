<template>
  <!-- Navigation desktop -->
  <nav class="navbar is-dark autumn-navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">
        <img src="/logo.png" alt="Logo" class="navbar-logo" />
        <span class="ml-2 is-hidden-mobile">{{ siteName }}</span>
      </router-link>

      <!-- Burger menu pour mobile -->
      <a
        role="button"
        class="navbar-burger"
        :class="{ 'is-active': isMobileMenuOpen }"
        aria-label="menu"
        :aria-expanded="isMobileMenuOpen"
        @click="toggleMobileMenu"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div class="navbar-menu" :class="{ 'is-active': isMobileMenuOpen }">
      <div class="navbar-start">
        <a href="#" class="navbar-item" @click.prevent="navigateToMap">
          <span class="icon">
            <i class="fas fa-map"></i>
          </span>
          <span>{{ $t('navigation.map') }}</span>
        </a>

        <router-link to="/about" class="navbar-item" @click="closeMobileMenu">
          <span class="icon">
            <i class="fas fa-info-circle"></i>
          </span>
          <span>{{ $t('navigation.about') }}</span>
        </router-link>
      </div>

      <div class="navbar-end">
        <!-- Sélecteur de langue -->
        <div class="navbar-item">
          <LanguageSelector />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import LanguageSelector from '@/components/ui/LanguageSelector.vue'
import { useConfig } from '@/composables/useConfig'

// Configuration
const { siteName } = useConfig()
const router = useRouter()
const route = useRoute()

// État du menu mobile
const isMobileMenuOpen = ref(false)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function navigateToMap() {
  closeMobileMenu()

  // Vérifier si l'introduction a déjà été vue
  const introSeen = localStorage.getItem('mapIntroSeen')

  if (!introSeen) {
    router.push('/map-intro')
  } else {
    router.push('/map')
  }
}

// Empêcher la fermeture automatique du menu sur la page de la carte
function handleClick(event: Event) {
  const target = event.target as Element

  // Sur les pages de carte, comportement spécialisé
  if (route.path === '/map' || route.path === '/map-intro') {
    // Fermer le menu si on clique sur un élément de navigation
    if (target.closest('.navbar-item') || target.closest('.navbar-burger')) {
      return // Laisser le comportement normal
    }

    // Permettre les clics sur les markers et popups
    if (
      target.closest('.leaflet-marker-icon') ||
      target.closest('.leaflet-popup') ||
      target.closest('.leaflet-control')
    ) {
      return // Laisser passer ces clics
    }

    // Fermer le menu seulement si on clique en dehors de la navbar ET de la carte interactive
    if (!target.closest('.navbar') && !target.closest('.leaflet-container')) {
      closeMobileMenu()
    }
    return
  }

  // Sur les autres pages, comportement normal de Bulma
  if (!target.closest('.navbar') && isMobileMenuOpen.value) {
    closeMobileMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClick, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClick, true)
})
</script>

<style scoped>
/* Navigation principale avec couleurs automne */
.autumn-navbar {
  background-color: var(--color-deep) !important;
}

.autumn-navbar .navbar-item {
  color: var(--color-white);
}

.autumn-navbar .navbar-item:hover {
  background-color: var(--color-accent);
  color: var(--color-white);
}

.autumn-navbar .navbar-burger {
  color: var(--color-white);
}

.autumn-navbar .navbar-burger:hover {
  background-color: var(--color-accent);
}

.navbar {
  z-index: var(--z-navbar);
  position: relative;
}

/* Assurer que la navbar reste visible sur mobile */
@media screen and (max-width: 1023px) {
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: var(--z-navbar);
  }

  /* Menu mobile avec taille appropriée */
  .navbar-menu.is-active {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--color-deep);
    z-index: calc(var(--z-navbar) - 1);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    border-radius: 0 0 6px 6px;
    max-height: 80vh;
    overflow-y: auto;
  }
}
</style>
