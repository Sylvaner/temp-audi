import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/stores/language'
import { watch } from 'vue'

export function useLanguage() {
  const { locale } = useI18n()
  const languageStore = useLanguageStore()

  // Synchroniser l'i18n avec le store
  watch(
    () => languageStore.currentLocale,
    (newLang) => {
      if (newLang && locale.value !== newLang) {
        locale.value = newLang
      }
    },
    { immediate: true },
  )

  function changeLanguage(languageCode: string) {
    languageStore.setLanguage(languageCode)
    locale.value = languageCode
    localStorage.setItem('preferred-language', languageCode)
  }

  return {
    currentLanguage: languageStore.currentLanguage,
    availableLanguages: languageStore.availableLanguages,
    currentLocale: languageStore.currentLocale,
    changeLanguage,
  }
}
