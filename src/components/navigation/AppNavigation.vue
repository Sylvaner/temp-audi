<template>
  <nav class="navbar is-dark theme-navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">
        <img src="/logo.png" alt="Logo" class="navbar-logo" />
        <span class="ml-2 is-hidden-mobile">{{ siteName }}</span>
      </router-link>

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
        <div class="navbar-item">
          <LanguageSelector />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import LanguageSelector from '@/components/ui/LanguageSelector.vue'
import { useConfig } from '@/composables/useConfig'

const { siteName } = useConfig()
const router = useRouter()
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

function handleOutsideClick(event: Event) {
  const target = event.target as Element

  // Fermer le menu si on clique en dehors de la navbar
  if (!target.closest('.navbar') && isMobileMenuOpen.value) {
    closeMobileMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<style scoped>
.theme-navbar {
  background-color: var(--color-deep) !important;
}

.theme-navbar .navbar-item {
  color: var(--color-white);
}

.theme-navbar .navbar-item:hover {
  background-color: var(--color-accent);
  color: var(--color-white);
}

.theme-navbar .navbar-burger {
  color: var(--color-white);
}

.theme-navbar .navbar-burger:hover {
  background-color: var(--color-accent);
}

.navbar {
  z-index: var(--z-overlay);
  position: relative;
}

@media screen and (max-width: 1023px) {
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: var(--z-overlay);
  }

  .navbar-menu.is-active {
    position: fixed;
    top: 52px;
    left: 0;
    right: 0;
    background-color: var(--color-deep);
    z-index: calc(var(--z-overlay) + 1);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    border-radius: 0 0 6px 6px;
    overflow: visible;
  }
}
</style>
