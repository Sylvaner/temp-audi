import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAppI18n } from '@/i18n'
import App from './App.vue'
import router from './router'
import { useLanguageStore } from '@/stores/language'
import '@/styles/variables.css'
import '@/styles/global.css'

const app = createApp(App)
const pinia = createPinia()
const i18n = createAppI18n()

app.use(pinia)
app.use(router)
app.use(i18n)

// Initialiser la langue automatiquement
const languageStore = useLanguageStore()
languageStore.initializeLanguage()

app.mount('#app')
