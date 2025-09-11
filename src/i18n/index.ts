/**
 * Configuration i18n pour Vue I18n
 */

import { createI18n } from 'vue-i18n'

// Import des messages de traduction
import fr from '@/locales/fr.json'
import en from '@/locales/en.json'

/**
 * Messages de traduction par langue
 */
const messages = {
  fr,
  en,
}

/**
 * Langues disponibles dans l'interface
 */
export const availableLocales = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
]

/**
 * Détecte la langue préférée du navigateur
 */
function getDefaultLocale(): string {
  const browserLocale = navigator.language.split('-')[0]
  return Object.keys(messages).includes(browserLocale) ? browserLocale : 'fr'
}

/**
 * Instance i18n configurée
 */
export const i18n = createI18n({
  locale: getDefaultLocale(), // langue par défaut
  fallbackLocale: 'fr', // langue de fallback
  messages,
  legacy: false, // utilise Composition API
  globalInjection: true, // permet d'utiliser $t dans les templates
})

/**
 * Type pour l'autocomplétion des clés de traduction
 */
export type MessageSchema = typeof fr
