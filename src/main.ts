import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { i18n } from '@/i18n'
import { useLanguageStore, setGlobalI18n } from '@/stores/language'
import '@/styles/variables.css'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(i18n)

// Configurer l'instance i18n dans le store
setGlobalI18n(i18n)

// Initialiser la langue automatiquement
const languageStore = useLanguageStore()
languageStore.initializeLanguage()

app.mount('#app')
