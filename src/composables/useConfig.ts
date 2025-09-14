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
  markerStyle: {
    defaultColor: string
    defaultPlaceIcon: string
    defaultUserLocationIcon: string
    defaultUserLocationColor: string
  }
}

const config = ref<Config>(dataJson.config as Config)

export function useConfig() {
  const languageStore = useLanguageStore()

  const siteName = computed(() => {
    const lang = languageStore.currentLanguage?.code || config.value.defaultLanguage || 'en'
    return (
      config.value.siteName[lang] ||
      config.value.siteName[config.value.defaultLanguage] ||
      'Audio Guide'
    )
  })

  const markerStyle = computed(() => {
    return (
      config.value.markerStyle || {
        defaultColor: '#B87333',
        defaultPlaceIcon: 'fa-monument',
        defaultUserLocationIcon: 'fa-person-walking',
        defaultUserLocationColor: '#007bff',
      }
    )
  })

  return {
    config: config.value,
    siteName,
    markerStyle,
  }
}
