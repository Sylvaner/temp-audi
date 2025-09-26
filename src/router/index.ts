import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MapView from '@/views/MapView.vue'
import MapIntroView from '@/views/MapIntroView.vue'

// Lazy loading pour composants non-critiques
const AboutView = () => import('@/views/AboutView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/map',
      name: 'map',
      component: MapView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/map-intro',
      name: 'map-intro',
      component: MapIntroView,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // Si il y a une position sauvegardée (ex: bouton retour du navigateur), l'utiliser
    if (savedPosition) {
      return savedPosition
    }
    // Sinon, toujours remonter en haut de la page instantanément
    return { top: 0 }
  },
})

export default router
