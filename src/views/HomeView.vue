<template>
  <div>
    <!-- Hero Section utilisant les classes Bulma natives -->
    <section class="hero is-fullheight has-background">
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

    <!-- Section d'information utilisant Bulma -->
    <section class="section has-background-primary has-text-white">
      <div class="container has-text-centered">
        <div class="icon-text is-flex-direction-column is-align-items-center mb-5">
          <span class="icon is-large has-background-white-ter is-rounded p-4 mb-4">
            <i class="fas fa-flag fa-2x has-text-primary"></i>
          </span>
        </div>

        <h3 class="title is-2 has-text-white">{{ $t('home.freeExploration') }}</h3>
        <p class="subtitle is-4 has-text-white-bis">{{ $t('home.freeExplorationDescription') }}</p>

        <!--
        DEBUG MODE LANGUE :
        Pour activer le mode debug de la langue, décommentez les lignes ci-dessous.
        Le composant LanguageDebug affiche :
        - Les langues détectées du navigateur
        - La langue actuellement sélectionnée
        - Les langues disponibles dans l'app
        - La langue par défaut configurée

        LanguageTester permet de tester les traductions en changeant de langue.
        Ces composants sont utiles pour débugger les problèmes de localisation.
        -->
        <!-- <LanguageDebug :show-debug="true" /> -->
        <!-- <LanguageTester /> -->
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useConfig } from '@/composables/useConfig'

// Imports pour le debug (décommentez si besoin)
// import LanguageDebug from '@/components/ui/LanguageDebug.vue'
// import LanguageTester from '@/components/ui/LanguageTester.vue'

const router = useRouter()
const { siteName } = useConfig()

function navigateToMap() {
  // Vérifier si l'introduction a déjà été vue
  //  localStorage.setItem('mapIntroSeen', 'false')
  const introSeen = localStorage.getItem('mapIntroSeen')
  if (introSeen !== 'true') {
    router.push('/map-intro')
  } else {
    router.push('/map')
  }
}
</script>

<style scoped>
/* Hero avec image de fond et overlay coloré */
.hero.has-background {
  position: relative;
  overflow: hidden;
  background-image: url('/images/home.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.hero.has-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(167, 140, 83, 0.6) 0%,
    rgba(150, 94, 41, 0.5) 50%,
    rgba(107, 53, 15, 0.6) 100%
  );
  z-index: var(--z-base);
}

.hero-body {
  position: relative;
  z-index: calc(var(--z-base) + 1);
}

/* Ombre portée pour améliorer la lisibilité */
.hero .title,
.hero .subtitle {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
}

/* Icône circulaire dans la section info */
.icon.is-rounded {
  border-radius: 50%;
}
</style>
