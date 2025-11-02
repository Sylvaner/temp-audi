<template>
  <div>
    <section class="hero is-fullheight has-background has-theme-overlay">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title is-1 has-text-white has-text-weight-bold">
            {{ siteName }}
          </h1>
          <h2 class="subtitle is-4 has-text-white" v-html="$t('home.title')"></h2>

          <div class="buttons is-centered mt-6">
            <button class="button is-large is-primary is-rounded" @click="navigateToMap">
              <span class="icon">
                <i class="fas fa-map"></i>
              </span>
              <span>{{ $t('home.visitButton') }}</span>
            </button>

            <router-link to="/about" class="button is-large is-light is-rounded">
              <span class="icon">
                <i class="fas fa-info-circle"></i>
              </span>
              <span>{{ $t('home.aboutButton') }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="section has-background-primary has-text-white">
      <div class="container has-text-centered">
        <div class="icon-text is-flex-direction-column is-align-items-center mb-5">
          <span class="icon is-large has-background-white-ter is-rounded p-4 mb-4">
            <i class="fas fa-flag fa-2x has-text-primary"></i>
          </span>
        </div>

        <h3 class="title is-2 has-text-white">{{ $t('home.freeExploration') }}</h3>
        <p class="subtitle is-4 has-text-white-bis">{{ $t('home.freeExplorationDescription') }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useConfig } from '@/composables/useConfig'

const router = useRouter()
const { siteName } = useConfig()

function navigateToMap() {
  const introSeen = localStorage.getItem('mapIntroSeen')
  if (introSeen !== 'true') {
    router.push('/map-intro')
  } else {
    router.push('/map')
  }
}
</script>

<style scoped>
.hero.has-background {
  position: relative;
  overflow: hidden;
  /* Support WebP avec fallback - créer home.webp (2.8MB → 400KB) */
  background-image: url('/images/home.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Fallback pour navigateurs sans WebP */
.no-webp .hero.has-background {
  background-image: url('/images/home.jpg');
}

.hero-body {
  position: relative;
  z-index: calc(var(--z-base) + 1);
}

.hero .title,
.hero .subtitle {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
}
</style>
