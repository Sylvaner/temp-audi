/**
 * Configuration i18n pour Vue I18n
 */

import { createI18n } from 'vue-i18n'
import type { LocaleMessages, VueMessageType } from 'vue-i18n'
import {
  getDefaultLanguage,
  getAppAvailableLanguages,
  getAvailableLanguagesWithMetadata,
  setActuallyAvailableLanguages,
} from '@/utils/language'

/**
 * Importation dynamique des fichiers de traduction (résolu au build-time)
 * Seuls les fichiers existants dans /locales/ seront inclus
 */
const localeModules = import.meta.glob('@/locales/*.json', { eager: true })

/**
 * Construction dynamique des messages à partir des fichiers existants
 * Vérifie que la langue est aussi disponible dans data.json
 */
function buildAvailableMessages() {
  const availableLanguages = getAppAvailableLanguages()
  const messages: Record<string, Record<string, unknown>> = {}

  // Parcourir tous les fichiers de traduction trouvés
  Object.entries(localeModules).forEach(([path, module]) => {
    // Extraire le code de langue du nom de fichier (ex: /locales/fr.json -> fr)
    const languageCode = path.match(/\/([^/]+)\.json$/)?.[1]

    if (languageCode && availableLanguages.includes(languageCode)) {
      // La langue existe dans data.json ET a un fichier de traduction
      const moduleContent =
        (module as { default?: Record<string, unknown> }).default ||
        (module as Record<string, unknown>)
      messages[languageCode] = moduleContent
    }
  })

  return messages
}

/**
 * Messages de traduction disponibles (intersection entre data.json et fichiers existants)
 */
const allMessages = buildAvailableMessages()

/**
 * Mettre à jour la liste des langues réellement disponibles
 * pour les autres parties du système
 */
setActuallyAvailableLanguages(Object.keys(allMessages))

/**
 * Messages de traduction filtrés (déjà filtré dans buildAvailableMessages)
 * Cast vers le type attendu par Vue I18n
 */
const messages = allMessages as Record<string, Record<string, string>>

/**
 * Langues disponibles dans l'interface (basées sur data.json)
 */
export const availableLocales = getAvailableLanguagesWithMetadata()

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
 * Utilise le premier message disponible comme référence
 */
export type MessageSchema = Record<string, string>
