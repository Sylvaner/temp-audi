/**
 * Store Pinia pour la gestion des langues et i18n
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { availableLocales } from '@/i18n'
import { detectBrowserLanguage, isLanguageSupported, getDefaultLanguage } from '@/utils/language'
import type { Place, PlaceContent } from '@/types'

// Référence globale à l'instance i18n (sera définie depuis main.ts)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let globalI18n: any = null

// Fonction pour définir l'instance i18n
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setGlobalI18n(instance: any) {
  globalI18n = instance
}

export const useLanguageStore = defineStore('language', () => {
  // État
  const currentLocale = ref(getDefaultLanguage())

  // Getters
  const availableLanguages = computed(() => availableLocales)
  const currentLanguage = computed(() =>
    availableLocales.find((lang) => lang.code === currentLocale.value),
  )

  // Actions
  function setLanguage(languageCode: string) {
    if (isLanguageSupported(languageCode)) {
      currentLocale.value = languageCode

      // Sauvegarde en localStorage
      localStorage.setItem('preferred-language', languageCode)
      
      // Mettre à jour l'i18n globalement
      if (globalI18n) {
        globalI18n.global.locale = languageCode
      }
    }
  }

  function initializeLanguage() {
    // Récupère la langue sauvegardée
    const savedLanguage = localStorage.getItem('preferred-language')
    
    let targetLanguage: string
    
    if (savedLanguage && isLanguageSupported(savedLanguage)) {
      // Utilise la langue sauvegardée si elle est valide
      targetLanguage = savedLanguage
    } else {
      // Sinon, détecte la langue du navigateur
      targetLanguage = detectBrowserLanguage()
    }

    setLanguage(targetLanguage)
  }

  /**
   * Récupère le contenu d'un lieu dans la langue actuelle
   * avec fallback intelligent
   */
  function getLocalizedContent(place: Place): PlaceContent | null {
    // Essaie la langue actuelle
    if (place.content[currentLocale.value]) {
      return place.content[currentLocale.value]
    }

    // Fallback sur français
    if (place.content.fr) {
      return place.content.fr
    }

    // Fallback sur la première langue disponible
    const firstAvailable = Object.keys(place.content)[0]
    if (firstAvailable) {
      return place.content[firstAvailable]
    }

    return null
  }

  /**
   * Vérifie si un lieu a du contenu dans la langue actuelle
   */
  function hasContentInCurrentLanguage(place: Place): boolean {
    return !!place.content[currentLocale.value]
  }

  return {
    // État
    currentLocale,

    // Getters
    availableLanguages,
    currentLanguage,

    // Actions
    setLanguage,
    initializeLanguage,
    getLocalizedContent,
    hasContentInCurrentLanguage,
  }
})
