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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LanguageSelector from '@/components/ui/LanguageSelector.vue'
import { useConfig } from '@/composables/useConfig'

// Configuration
const { siteName } = useConfig()
const router = useRouter()

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
</style>
