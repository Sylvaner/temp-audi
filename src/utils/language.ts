/**
 * Utilitaires pour la gestion des langues
 */

import type { Place, PlaceContent } from '@/types'
import dataJson from '@/data/data.json'

interface LanguageConfig {
  defaultLanguage: string
  availableLanguages: string[]
}

const config = dataJson.config as LanguageConfig

/**
 * Récupère le contenu d'un lieu dans la langue demandée
 * avec fallback sur la langue par défaut
 */
export function getPlaceContent(
  place: Place,
  language: string,
  defaultLanguage: string = 'fr'
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
    if (config.availableLanguages.includes(browserLang)) {
      return browserLang
    }
    
    // Teste ensuite juste le code de langue (ex: fr de fr-FR)
    const langCode = browserLang.split('-')[0]
    if (config.availableLanguages.includes(langCode)) {
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
  return config.availableLanguages.includes(languageCode)
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
