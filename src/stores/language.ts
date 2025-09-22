import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { availableLocales } from '@/i18n'
import {
  detectBrowserLanguage,
  isLanguageSupported,
  getDefaultLanguage,
  getPlaceContent,
} from '@/utils/language'
import type { Place } from '@/types'

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

  function getLocalizedContent(place: Place) {
    return getPlaceContent(place, currentLocale.value)
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
