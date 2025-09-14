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
  // Sur les pages de carte, ne fermer le menu que si on clique sur un élément de navigation
  if (route.path === '/map' || route.path === '/map-intro') {
    const target = event.target as Element

    // Permettre la fermeture seulement si on clique sur la navbar ou ses éléments
    if (target.closest('.navbar-item') || target.closest('.navbar-burger')) {
      return // Laisser le comportement normal
    }

    // Empêcher la fermeture pour tous les autres clics (carte, etc.)
    event.stopPropagation()
    return
  }

  // Sur les autres pages, comportement normal de Bulma
  const target = event.target as Element
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

  /* Empêcher que le menu se ferme automatiquement sur la carte */
  .navbar-menu.is-active {
    position: fixed;
    top: 52px; /* Hauteur de la navbar */
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-deep);
    z-index: calc(var(--z-navbar) - 1);
    overflow-y: auto;
  }
}
</style>
