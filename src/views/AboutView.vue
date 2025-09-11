<template>
  <div class="about-view">
    <!-- Section hero avec image de fond -->
    <div class="hero-section">
      <div class="hero-background"></div>
      <div class="hero-content">
        <div class="container has-text-centered">
          <h1 class="hero-title">{{ $t('about.title') }}</h1>
          <p class="hero-subtitle">{{ $t('about.subtitle') }}</p>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="content-section">
      <div class="container">
        <!-- Introduction -->
        <section class="section">
          <div class="columns is-vcentered">
            <div class="column is-7">
              <h2 class="title is-3">{{ $t('about.introduction.title') }}</h2>
              <div class="content is-medium">
                <p>{{ $t('about.introduction.description1') }}</p>
                <p>{{ $t('about.introduction.description2') }}</p>
              </div>
            </div>
            <div class="column is-5">
              <figure class="image">
                <img src="/images/grand-bassin.jpg" :alt="$t('about.introduction.imageAlt')" />
              </figure>
            </div>
          </div>
        </section>

        <!-- Histoire -->
        <section class="section">
          <div class="columns is-vcentered">
            <div class="column is-5">
              <figure class="image">
                <img src="/images/grille-du-roi.jpg" :alt="$t('about.history.imageAlt')" />
              </figure>
            </div>
            <div class="column is-7">
              <h2 class="title is-3">{{ $t('about.history.title') }}</h2>
              <div class="content is-medium">
                <p>{{ $t('about.history.description1') }}</p>
                <p>{{ $t('about.history.description2') }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Aujourd'hui -->
        <section class="section">
          <div class="columns is-vcentered">
            <div class="column is-7">
              <h2 class="title is-3">{{ $t('about.today.title') }}</h2>
              <div class="content is-medium">
                <p>{{ $t('about.today.description1') }}</p>
                <p>{{ $t('about.today.description2') }}</p>
              </div>
            </div>
            <div class="column is-5">
              <figure class="image">
                <img src="/images/jardin-lelieur.jpg" :alt="$t('about.today.imageAlt')" />
              </figure>
            </div>
          </div>
        </section>

        <!-- Section visite -->
        <section class="section visit-section">
          <div class="container has-text-centered">
            <div class="visit-content">
              <h2 class="title is-2">{{ $t('about.visit.title') }}</h2>
              <p class="subtitle is-4">{{ $t('about.visit.description') }}</p>

              <div class="buttons is-centered">
                <router-link to="/map" class="button is-primary is-large">
                  <span class="icon">
                    <i class="fas fa-map"></i>
                  </span>
                  <span>{{ $t('about.visit.exploreButton') }}</span>
                </router-link>

                <a
                  href="https://www.ecole-paysage.fr/fr/potager-du-roi"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="button is-link is-large"
                >
                  <span class="icon">
                    <i class="fas fa-external-link-alt"></i>
                  </span>
                  <span>{{ $t('about.visit.officialSiteButton') }}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Pas de logique spécifique nécessaire pour cette page
</script>

<style scoped>
.about-view {
  min-height: 100vh;
  position: relative;
}

/* Section hero */
.hero-section {
  height: 50vh;
  min-height: 400px;
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
  background-image: url('/images/point-de-vue.jpg');
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
    rgba(192, 161, 95, 0.7) 0%,
    rgba(184, 115, 51, 0.6) 50%,
    rgba(139, 69, 19, 0.7) 100%
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
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-subtitle {
  font-size: 1.5rem;
  color: var(--color-white);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* Contenu principal */
.content-section {
  background-color: var(--color-background);
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.section {
  padding: 3rem 0;
}

.section:not(:last-child) {
  border-bottom: 1px solid var(--color-border);
}

.title {
  color: var(--color-primary);
  margin-bottom: 1.5rem;
}

.content {
  line-height: 1.8;
}

.image {
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-medium);
}

.image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* Section visite */
.visit-section {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  padding: 4rem 0;
}

.visit-content {
  color: var(--color-white);
}

.visit-content .title {
  color: var(--color-white);
}

.visit-content .subtitle {
  color: var(--color-white);
  opacity: 0.9;
  margin-bottom: 2rem;
}

.buttons {
  gap: 1rem;
}

.button.is-primary {
  background-color: var(--color-white);
  color: var(--color-primary);
  border: none;
}

.button.is-primary:hover {
  background-color: var(--color-background-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-large);
}

.button.is-link {
  background-color: transparent;
  color: var(--color-white);
  border: 2px solid var(--color-white);
}

.button.is-link:hover {
  background-color: var(--color-white);
  color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-large);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    height: 40vh;
    min-height: 300px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .section {
    padding: 2rem 0;
  }

  .columns {
    flex-direction: column-reverse;
  }

  .columns:nth-child(even) {
    flex-direction: column;
  }

  .content-section {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
}
</style>
