<template>
  <div class="home-view">
    <!-- Hero avec image de fond pleine page -->
    <div class="hero-fullscreen">
      <div class="hero-background"></div>
      <div class="hero-content">
        <div class="container has-text-centered">
          <h1 class="hero-title">
            {{ siteName }}
          </h1>
          <h2 class="hero-subtitle" v-html="$t('home.title')"></h2>

          <div class="hero-buttons">
            <router-link to="/map" class="hero-button primary">
              <span class="button-icon">
                <i class="fas fa-map"></i>
              </span>
              <span class="button-text">{{ $t('home.visitButton') }}</span>
            </router-link>

            <router-link to="/about" class="hero-button secondary">
              <span class="button-icon">
                <i class="fas fa-info-circle"></i>
              </span>
              <span class="button-text">{{ $t('home.aboutButton') }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Section d'information avec icône centrée -->
    <div class="info-section">
      <div class="container has-text-centered">
        <div class="info-icon-large">
          <i class="fas fa-flag"></i>
        </div>
        <h3 class="info-title-large">{{ $t('home.freeExploration') }}</h3>
        <p class="info-description-large">{{ $t('home.freeExplorationDescription') }}</p>

        <!-- Debug de langue (temporaire) -->
        <LanguageDebug :show-debug="true" />
        <LanguageTester />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfig } from '@/composables/useConfig'
import LanguageDebug from '@/components/ui/LanguageDebug.vue'
import LanguageTester from '@/components/ui/LanguageTester.vue'

// Configuration
const { siteName } = useConfig()
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  position: relative;
}

/* Hero fullscreen avec image de fond */
.hero-fullscreen {
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/images/home.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
}

.hero-background::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(192, 161, 95, 0.6) 0%,
    rgba(184, 115, 51, 0.5) 50%,
    rgba(139, 69, 19, 0.6) 100%
  );
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 3;
  width: 100%;
  padding: 2rem;
}

.hero-title {
  font-size: 4rem;
  font-weight: bold;
  color: white;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: white;
  margin-bottom: 3rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  line-height: 1.4;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.hero-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.hero-button {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.hero-button.primary {
  background-color: rgba(139, 69, 19, 0.9);
  color: white;
}

.hero-button.secondary {
  background-color: rgba(255, 255, 255, 0.9);
  color: var(--color-primary);
}

.hero-button.primary:hover {
  background-color: rgba(114, 47, 55, 0.9);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.hero-button.secondary:hover {
  background-color: rgba(255, 255, 255, 1);
  color: var(--color-accent);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.button-icon {
  font-size: 1.5rem;
}

/* Section d'information en bas */
.info-section {
  background-color: var(--color-primary);
  padding: 4rem 2rem;
  color: white;
}

.info-icon-large {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  font-size: 2.5rem;
}

.info-title-large {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: white;
}

.info-description-large {
  font-size: 1.25rem;
  color: white;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
}

/* Responsive */
@media screen and (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .hero-button {
    padding: 0.8rem 2rem;
    font-size: 1.1rem;
    width: 100%;
    max-width: 280px;
  }

  .info-title-large {
    font-size: 2rem;
  }

  .info-description-large {
    font-size: 1.1rem;
  }

  .info-section {
    padding: 3rem 1rem;
  }
}

@media screen and (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-content {
    padding: 1rem;
  }
}
</style>
