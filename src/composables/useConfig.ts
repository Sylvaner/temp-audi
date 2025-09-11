import { ref, computed } from 'vue'
import { useLanguageStore } from '@/stores/language'
import dataJson from '@/data/data.json'

interface Config {
  siteName: Record<string, string>
  map: {
    center: {
      latitude: number
      longitude: number
    }
    zoom: number
  }
  defaultLanguage: string
  availableLanguages: string[]
  icons?: {
    place: string
    userLocation: string
  }
}

const config = ref<Config>(dataJson.config as Config)

export function useConfig() {
  const languageStore = useLanguageStore()

  const siteName = computed(() => {
    const lang = languageStore.currentLanguage?.code || 'fr'
    return config.value.siteName[lang] || config.value.siteName['fr'] || 'Audio Guide'
  })

  const icons = computed(() => {
    return (
      config.value.icons || {
        place: 'fa-monument',
        userLocation: 'fa-person-walking',
      }
    )
  })

  return {
    config: config.value,
    siteName,
    icons,
  }
}
