/**
 * Store Pinia pour la gestion de la géolocalisation
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Position } from '@/types'
import dataJson from '@/data/data.json'
import { useGeolocationManager, useGeolocationCalculator } from '@/composables/useGeolocation'

// Type simplifié pour la configuration géolocalisation
type GeolocationConfig = {
  siteName: Record<string, string>
  map: {
    center: Position
    zoom: number
    goToInitialUserLocation?: {
      enable: boolean
      threshold: number
      increaseZoom: number
    }
  }
  defaultLanguage: string
  availableLanguages: string[]
}

export const useGeolocationStore = defineStore('geolocation', () => {
  // Configuration depuis data.json
  const config = dataJson.config as GeolocationConfig

  // Initialiser depuis localStorage
  const getStoredPermissionStatus = (): 'unknown' | 'granted' | 'denied' | 'requesting' => {
    const stored = localStorage.getItem('geolocation-permission-status')
    if (stored && ['unknown', 'granted', 'denied', 'requesting'].includes(stored)) {
      return stored as 'unknown' | 'granted' | 'denied' | 'requesting'
    }
    return 'unknown'
  }

  const getStoredMoveToUserLocation = (): boolean => {
    const stored = localStorage.getItem('geolocation-move-to-user')
    return stored ? JSON.parse(stored) : true
  }

  // État principal
  const userPosition = ref<Position | null>(null)
  const permissionStatus = ref<'unknown' | 'granted' | 'denied' | 'requesting'>(
    getStoredPermissionStatus(),
  )
  const isWatching = ref(false)
  const lastError = ref<string | null>(null)
  const moveToUserLocation = ref(getStoredMoveToUserLocation()) // Option pour centrer automatiquement sur l'utilisateur
  const hasTriggeredInitialCentering = ref(false) // Pour éviter de centrer plusieurs fois

  // Gestionnaire de géolocalisation (composable)
  const geolocationManager = useGeolocationManager({
    onPositionUpdate: (position: Position) => {
      userPosition.value = position
      if (!hasTriggeredInitialCentering.value) {
        hasTriggeredInitialCentering.value = true
      }
    },
    onPermissionChange: (status: 'granted' | 'denied') => {
      permissionStatus.value = status
      localStorage.setItem('geolocation-permission-status', status)
    },
    onError: (error: string) => {
      lastError.value = error
    },
  })

  // Calculateur géographique (composable)
  const geoCalculator = useGeolocationCalculator({
    userPosition,
    mapCenter: config.map.center,
    threshold: config.map.goToInitialUserLocation?.threshold || 0.08,
    increaseZoom: config.map.goToInitialUserLocation?.increaseZoom || 1,
    baseZoom: config.map.zoom,
  })

  // Getters
  const hasPermission = computed(() => permissionStatus.value === 'granted')
  const hasPosition = computed(() => userPosition.value !== null)
  const isLocationAvailable = computed(() => geolocationManager.isAvailable)

  // Getters géographiques (délégués au calculateur)
  const isUserInInitialArea = computed(() => {
    return config.map.goToInitialUserLocation?.enable && geoCalculator.isUserInArea.value
  })

  const shouldCenterOnUser = computed(() => {
    return (
      config.map.goToInitialUserLocation?.enable &&
      geoCalculator.shouldCenterOnUser.value &&
      !hasTriggeredInitialCentering.value
    )
  })

  const getIncreasedZoom = computed(() => geoCalculator.increasedZoom.value)

  // Actions (délégées aux composables)
  async function requestPermission(): Promise<boolean> {
    if (!geolocationManager.isAvailable) {
      lastError.value = 'Géolocalisation non disponible sur ce navigateur'
      return false
    }

    permissionStatus.value = 'requesting'
    lastError.value = null

    return await geolocationManager.requestPermission()
  }

  function startWatching() {
    if ((!hasPermission.value && permissionStatus.value !== 'granted') || isWatching.value) return

    const success = geolocationManager.startWatching()
    if (success) {
      isWatching.value = true
    }
  }

  function stopWatching() {
    geolocationManager.stopWatching()
    isWatching.value = false
  }

  function clearError() {
    lastError.value = null
  }

  function toggleMoveToUserLocation() {
    moveToUserLocation.value = !moveToUserLocation.value
    localStorage.setItem('geolocation-move-to-user', JSON.stringify(moveToUserLocation.value))
  }

  function setMoveToUserLocation(value: boolean) {
    moveToUserLocation.value = value
    localStorage.setItem('geolocation-move-to-user', JSON.stringify(value))
  }

  async function initializeGeolocation() {
    // Si on a déjà la permission, essayer de récupérer la position
    if (permissionStatus.value === 'granted' && geolocationManager.isAvailable) {
      const position = await geolocationManager.getCurrentPosition()
      if (position) {
        userPosition.value = position
        // Démarrer le suivi automatiquement si on a la permission
        if (!isWatching.value) {
          startWatching()
        }
      } else {
        // Si erreur, remettre le status à unknown pour redemander
        permissionStatus.value = 'unknown'
        localStorage.removeItem('geolocation-permission-status')
      }
    }
  }

  function reset() {
    stopWatching()
    userPosition.value = null
    permissionStatus.value = 'unknown'
    lastError.value = null
    hasTriggeredInitialCentering.value = false
    localStorage.removeItem('geolocation-permission-status')
    // Ne pas réinitialiser moveToUserLocation pour conserver la préférence
  }

  return {
    // État
    userPosition,
    permissionStatus,
    isWatching,
    lastError,
    moveToUserLocation,

    // Getters
    hasPermission,
    hasPosition,
    isLocationAvailable,
    isUserInInitialArea,
    shouldCenterOnUser,
    getIncreasedZoom,

    // Actions
    requestPermission,
    startWatching,
    stopWatching,
    clearError,
    reset,
    toggleMoveToUserLocation,
    setMoveToUserLocation,
    initializeGeolocation,
  }
})
