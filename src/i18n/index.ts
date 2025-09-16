/**
 * Configuration i18n pour Vue I18n
 */

import { createI18n } from 'vue-i18n'
import { getDefaultLanguage } from '@/utils/language'

// Import des messages de traduction
import fr from '@/locales/fr.json'
import en from '@/locales/en.json'
import de from '@/locales/de.json'

/**
 * Messages de traduction par langue
 */
const messages = {
  fr,
  en,
  de,
}

/**
 * Langues disponibles dans l'interface
 */
export const availableLocales = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
]

/**
 * Instance i18n configurée
 */
export const i18n = createI18n({
  locale: getDefaultLanguage(), // langue par défaut depuis la configuration
  fallbackLocale: getDefaultLanguage(), // langue de fallback depuis la configuration
  messages,
  legacy: false, // utilise Composition API
  globalInjection: true, // permet d'utiliser $t dans les templates
})

/**
 * Type pour l'autocomplétion des clés de traduction
 */
export type MessageSchema = typeof fr
