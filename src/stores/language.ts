import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { availableLocales } from '@/i18n'
import { detectBrowserLanguage, isLanguageSupported, getDefaultLanguage } from '@/utils/language'
import type { Place, PlaceContent } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let globalI18n: any = null

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

  function setLanguage(languageCode: string) {
    if (isLanguageSupported(languageCode)) {
      currentLocale.value = languageCode
      localStorage.setItem('preferred-language', languageCode)

      if (globalI18n) {
        globalI18n.global.locale.value = languageCode
      }
    }
  }

  function initializeLanguage() {
    const savedLanguage = localStorage.getItem('preferred-language')
    let targetLanguage: string

    if (savedLanguage && isLanguageSupported(savedLanguage)) {
      targetLanguage = savedLanguage
    } else {
      targetLanguage = detectBrowserLanguage()
    }

    setLanguage(targetLanguage)
  }

  function getLocalizedContent(place: Place): PlaceContent | null {
    if (place.content[currentLocale.value]) {
      return place.content[currentLocale.value]
    }

    if (place.content.fr) {
      return place.content.fr
    }

    const firstAvailable = Object.keys(place.content)[0]
    if (firstAvailable) {
      return place.content[firstAvailable]
    }

    return null
  }

  function hasContentInCurrentLanguage(place: Place): boolean {
    return !!place.content[currentLocale.value]
  }

  return {
    currentLocale,
    availableLanguages,
    currentLanguage,
    setLanguage,
    initializeLanguage,
    getLocalizedContent,
    hasContentInCurrentLanguage,
  }
})
