import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAppI18n } from '@/i18n'
import App from './App.vue'
import router from './router'
import { useConfig } from '@/composables/useConfig'
import { useLanguageStore } from '@/stores/language'
import { watch } from 'vue'
import '@/styles/variables.css'
import '@/styles/global.css'

// Font Awesome
import { FontAwesomeIcon } from '@/plugins/fontawesome'

const app = createApp(App)

// Enregistrer le composant FontAwesome globalement
app.component('FontAwesomeIcon', FontAwesomeIcon)
const pinia = createPinia()
const i18n = createAppI18n()

app.use(pinia)
app.use(router)
app.use(i18n)

const { siteName } = useConfig()

// Synchronisation globale de la langue
const languageStore = useLanguageStore()
watch(
  () => languageStore.currentLocale,
  (newLocale) => {
    i18n.global.locale.value = newLocale
  },
  { immediate: true },
)
// Traduction du titre de la page
watch(
  siteName,
  (newSiteName) => {
    document.title = newSiteName
  },
  { immediate: true },
)

languageStore.initializeLanguage()

app.mount('#app')
