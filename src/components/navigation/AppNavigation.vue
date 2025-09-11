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
        <router-link to="/map" class="navbar-item" @click="closeMobileMenu">
          <span class="icon">
            <i class="fas fa-map"></i>
          </span>
          <span>{{ $t('navigation.map') }}</span>
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
import LanguageSelector from '@/components/ui/LanguageSelector.vue'
import { useConfig } from '@/composables/useConfig'

// Configuration
const { siteName } = useConfig()

// État du menu mobile
const isMobileMenuOpen = ref(false)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
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
