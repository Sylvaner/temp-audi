/**
 * Utilitaires pour la gestion des langues
 */

import type { Place, PlaceContent } from '@/types'
import dataJson from '@/data/data.json'

const config = dataJson.config

/**
 * Récupère les langues réellement disponibles (intersection data.json + fichiers locales)
 * Cette fonction sera mise à jour par le système i18n
 */
let actuallyAvailableLanguages: string[] = []

/**
 * Met à jour la liste des langues réellement disponibles
 * @param languages Langues trouvées avec fichiers de traduction
 */
export function setActuallyAvailableLanguages(languages: string[]) {
  actuallyAvailableLanguages = languages
}

/**
 * Récupère les langues réellement disponibles (avec fichiers de traduction)
 * @returns Tableau des codes de langues réellement disponibles
 */
export function getActuallyAvailableLanguages(): string[] {
  return actuallyAvailableLanguages.length > 0
    ? actuallyAvailableLanguages
    : config.availableLanguages
}

/**
 * Récupère le contenu d'un lieu dans la langue demandée
 * avec fallback sur la langue par défaut
 */
export function getPlaceContent(
  place: Place,
  language: string,
  defaultLanguage: string = config.defaultLanguage,
): PlaceContent | null {
  // Essaie la langue demandée
  if (place.content[language]) {
    return place.content[language]
  }

  // Fallback sur la langue par défaut
  if (place.content[defaultLanguage]) {
    return place.content[defaultLanguage]
  }

  // Fallback sur la première langue disponible
  const firstAvailable = Object.keys(place.content)[0]
  if (firstAvailable) {
    return place.content[firstAvailable]
  }

  return null
}

/**
 * Vérifie si un lieu a du contenu dans une langue donnée
 */
export function hasLanguage(place: Place, language: string): boolean {
  return !!place.content[language]
}

/**
 * Récupère toutes les langues disponibles pour un lieu
 */
export function getAvailableLanguages(place: Place): string[] {
  return Object.keys(place.content)
}

/**
 * Détecte la meilleure langue à utiliser en fonction des préférences du navigateur
 * @returns Le code de langue détecté ou la langue par défaut
 */
export function detectBrowserLanguage(): string {
  // Récupère toutes les langues préférées du navigateur
  const browserLanguages = navigator.languages || [navigator.language]

  // Teste chaque langue du navigateur dans l'ordre de préférence
  for (const browserLang of browserLanguages) {
    // Teste d'abord la langue complète (ex: fr-FR)
    if (getActuallyAvailableLanguages().includes(browserLang)) {
      return browserLang
    }

    // Teste ensuite juste le code de langue (ex: fr de fr-FR)
    const langCode = browserLang.split('-')[0]
    if (getActuallyAvailableLanguages().includes(langCode)) {
      return langCode
    }
  }

  // Retourne la langue par défaut si aucune correspondance
  return config.defaultLanguage
}

/**
 * Vérifie si une langue est supportée par l'application
 * @param languageCode Le code de langue à vérifier
 * @returns true si la langue est supportée
 */
export function isLanguageSupported(languageCode: string): boolean {
  return getActuallyAvailableLanguages().includes(languageCode)
}

/**
 * Récupère la langue par défaut de l'application
 * @returns Le code de langue par défaut
 */
export function getDefaultLanguage(): string {
  return config.defaultLanguage
}

/**
 * Récupère toutes les langues disponibles dans l'application
 * @returns Tableau des codes de langues disponibles
 */
export function getAppAvailableLanguages(): string[] {
  return config.availableLanguages
}

/**
 * Normalise un code de langue (retire les spécificités régionales si nécessaire)
 * @param languageCode Le code de langue à normaliser
 * @returns Le code de langue normalisé
 */
export function normalizeLanguageCode(languageCode: string): string {
  // Si la langue complète est supportée, la retourner
  if (isLanguageSupported(languageCode)) {
    return languageCode
  }

  // Sinon, essayer juste le code de base
  const baseCode = languageCode.split('-')[0]
  if (isLanguageSupported(baseCode)) {
    return baseCode
  }

  // Retourner la langue par défaut si rien ne correspond
  return getDefaultLanguage()
}

/**
 * Interface pour les objets de langue avec métadonnées
 */
export interface LanguageInfo {
  code: string
  name: string
  flag: string
}

/**
 * Métadonnées des langues supportées - Top 20 des langues les plus répandues
 */
const languageMetadata: Record<string, Omit<LanguageInfo, 'code'>> = {
  // Langues européennes
  en: { name: 'English', flag: '🇬🇧' },
  es: { name: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  pt: { name: 'Português', flag: '🇵🇹' },
  ru: { name: 'Русский', flag: '🇷🇺' },
  nl: { name: 'Nederlands', flag: '🇳🇱' },
  pl: { name: 'Polski', flag: '🇵🇱' },
  zh: { name: '中文', flag: '🇨🇳' },
  ja: { name: '日本語', flag: '🇯🇵' },
  ko: { name: '한국어', flag: '🇰🇷' },
  ar: { name: 'العربية', flag: '🇸🇦' },
  tr: { name: 'Türkçe', flag: '🇹🇷' },
}

/**
 * Récupère les langues disponibles avec leurs métadonnées
 * @returns Tableau des langues avec code, nom et drapeau
 */
export function getAvailableLanguagesWithMetadata(): LanguageInfo[] {
  return getActuallyAvailableLanguages().map((code) => ({
    code,
    name: languageMetadata[code]?.name || code,
    flag: languageMetadata[code]?.flag || '🌐',
  }))
}
