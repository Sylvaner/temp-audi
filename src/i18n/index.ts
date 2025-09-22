import { createI18n } from 'vue-i18n'
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

// Messages construits dynamiquement

/**
 * Langues disponibles dans l'interface (basées sur data.json)
 */
export const availableLocales = getAvailableLanguagesWithMetadata()

/**
 * Fonction pour créer l'instance i18n (pattern Vue 3)
 */
export function createAppI18n() {
  return createI18n({
    locale: getDefaultLanguage(),
    fallbackLocale: getDefaultLanguage(),
    messages: allMessages as Record<string, Record<string, string>>,
    legacy: false,
    globalInjection: true,
    missingWarn: false,
    fallbackWarn: false,
  })
}

/**
 * Type pour l'autocomplétion des clés de traduction
 * Utilise le premier message disponible comme référence
 */
export type MessageSchema = Record<string, string>
