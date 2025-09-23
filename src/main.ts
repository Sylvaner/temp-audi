import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAppI18n } from '@/i18n'
import App from './App.vue'
import router from './router'
import { useLanguageStore } from '@/stores/language'
import { watch } from 'vue'
import '@/styles/variables.css'
import '@/styles/global.css'

const app = createApp(App)
const pinia = createPinia()
const i18n = createAppI18n()

app.use(pinia)
app.use(router)
app.use(i18n)

// Synchroniser le store de langue avec vue-i18n
const languageStore = useLanguageStore()

// Watcher pour synchroniser les changements de langue
watch(
  () => languageStore.currentLocale,
  (newLocale) => {
    i18n.global.locale.value = newLocale
  },
  { immediate: true },
)

// Initialiser la langue automatiquement
languageStore.initializeLanguage()

app.mount('#app')
