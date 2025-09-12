<template>
  <div class="about-view">
    <section class="hero is-medium custom-hero">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title is-1 has-text-white">{{ $t('about.title') }}</h1>
          <p class="subtitle is-4 has-text-white">{{ $t('about.subtitle') }}</p>
        </div>
      </div>
    </section>

    <div class="has-background-light">
      <div class="container">
        <section class="section">
          <div class="columns is-vcentered">
            <div class="column is-7">
              <h2 class="title is-3 has-text-primary">{{ $t('about.introduction.title') }}</h2>
              <div class="content is-medium">
                <p>{{ $t('about.introduction.description1') }}</p>
                <p>{{ $t('about.introduction.description2') }}</p>
              </div>
            </div>
            <div class="column is-5">
              <figure class="image custom-image">
                <img src="/images/grand-bassin.jpg" :alt="$t('about.introduction.imageAlt')" />
              </figure>
            </div>
          </div>
        </section>

        <hr class="has-background-grey-lighter" />

        <section class="section">
          <div class="columns is-vcentered">
            <div class="column is-5">
              <figure class="image custom-image">
                <img src="/images/grille-du-roi.jpg" :alt="$t('about.history.imageAlt')" />
              </figure>
            </div>
            <div class="column is-7">
              <h2 class="title is-3 has-text-primary">{{ $t('about.history.title') }}</h2>
              <div class="content is-medium">
                <p>{{ $t('about.history.description1') }}</p>
                <p>{{ $t('about.history.description2') }}</p>
              </div>
            </div>
          </div>
        </section>

        <hr class="has-background-grey-lighter" />

        <section class="section">
          <div class="columns is-vcentered">
            <div class="column is-7">
              <h2 class="title is-3 has-text-primary">{{ $t('about.today.title') }}</h2>
              <div class="content is-medium">
                <p>{{ $t('about.today.description1') }}</p>
                <p>{{ $t('about.today.description2') }}</p>
              </div>
            </div>
            <div class="column is-5">
              <figure class="image custom-image">
                <img src="/images/jardin-lelieur.jpg" :alt="$t('about.today.imageAlt')" />
              </figure>
            </div>
          </div>
        </section>
      </div>
    </div>

    <section class="hero is-primary is-medium">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h2 class="title is-2">{{ $t('about.visit.title') }}</h2>
          <p class="subtitle is-4">{{ $t('about.visit.description') }}</p>

          <div class="buttons is-centered">
            <router-link
              to="/map"
              class="button is-white is-large is-centered custom-button-primary"
            >
              <span class="icon">
                <i class="fas fa-map"></i>
              </span>
              <span>{{ $t('about.visit.exploreButton') }}</span>
            </router-link>

            <a
              href="https://www.ecole-paysage.fr/fr/potager-du-roi"
              target="_blank"
              rel="noopener noreferrer"
              class="button is-white is-outlined is-large is-centered custom-button-secondary"
            >
              <span class="icon">
                <i class="fas fa-globe"></i>
              </span>
              <span>{{ $t('about.visit.officialSiteButton') }}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
/* Hero personnalisé avec image de fond */
.custom-hero {
  background-image:
    linear-gradient(
      135deg,
      rgba(192, 161, 95, 0.7) 0%,
      rgba(184, 115, 51, 0.6) 50%,
      rgba(139, 69, 19, 0.7) 100%
    ),
    url('/images/point-de-vue.jpg');
  background-size: cover;
  background-position: center;
}

.custom-hero .title,
.custom-hero .subtitle {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* Images avec style */
.custom-image {
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-medium);
  border: 2px solid var(--color-border-light);
}

/* Boutons personnalisés */
.custom-button-primary {
  color: var(--color-primary) !important;
  border-color: var(--color-primary) !important;
}

.custom-button-primary:hover {
  background-color: var(--color-primary) !important;
  color: var(--color-white) !important;
  transform: translateY(-2px);
  box-shadow: var(--shadow-large);
}

.custom-button-secondary:hover {
  background-color: var(--color-secondary) !important;
  color: var(--color-white) !important;
  transform: translateY(-2px);
  box-shadow: var(--shadow-large);
}

/* Responsive mobile */
@media (max-width: 768px) {
  .columns {
    flex-direction: column-reverse;
  }

  .columns:nth-child(2) {
    flex-direction: column;
  }
}
</style>
