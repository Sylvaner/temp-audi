/**
 * Store Pinia pour la gestion de la géolocalisation
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Position } from '@/types'
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
  goToInitialUserLocation?: {
    enable: boolean
    threshold: number
    increaseZoom: number
  }
  defaultLanguage: string
  availableLanguages: string[]
}

export const useGeolocationStore = defineStore('geolocation', () => {
  // Configuration depuis data.json
  const config = dataJson.config as Config

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

  // État
  const userPosition = ref<Position | null>(null)
  const permissionStatus = ref<'unknown' | 'granted' | 'denied' | 'requesting'>(
    getStoredPermissionStatus(),
  )
  const isWatching = ref(false)
  const lastError = ref<string | null>(null)
  const watchId = ref<number | null>(null)
  const moveToUserLocation = ref(getStoredMoveToUserLocation()) // Option pour centrer automatiquement sur l'utilisateur
  const hasTriggeredInitialCentering = ref(false) // Pour éviter de centrer plusieurs fois

  // Getters
  const hasPermission = computed(() => permissionStatus.value === 'granted')
  const hasPosition = computed(() => userPosition.value !== null)
  const isLocationAvailable = computed(() => 'geolocation' in navigator)

  // Méthode pour calculer la distance entre deux points (en degrés)
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const deltaLat = Math.abs(lat1 - lat2)
    const deltaLon = Math.abs(lon1 - lon2)
    return Math.sqrt(deltaLat * deltaLat + deltaLon * deltaLon)
  }

  // Méthode pour vérifier si l'utilisateur est dans la zone du centre de la carte
  const isUserInInitialArea = computed(() => {
    if (!userPosition.value || !config.goToInitialUserLocation?.enable) return false

    const distance = calculateDistance(
      userPosition.value.latitude,
      userPosition.value.longitude,
      config.map.center.latitude,
      config.map.center.longitude,
    )
    
    const threshold = config.goToInitialUserLocation.threshold || 0.08
    console.log('Distance to initial center:', distance)
    console.log('Threshold:', threshold)
    console.log('Is user in initial area:', distance <= threshold)
    
    return distance <= threshold
  })

  // Méthode pour vérifier si on doit centrer automatiquement
  const shouldCenterOnUser = computed(() => {
    return (
      config.goToInitialUserLocation?.enable &&
      isUserInInitialArea.value &&
      !hasTriggeredInitialCentering.value
    )
  })

  // Méthode pour obtenir le zoom augmenté
  const getIncreasedZoom = computed(() => {
    const increaseZoom = config.goToInitialUserLocation?.increaseZoom || 1
    return config.map.zoom + increaseZoom
  })

  // Actions
  async function requestPermission(): Promise<boolean> {
    if (!isLocationAvailable.value) {
      lastError.value = 'Géolocalisation non disponible sur ce navigateur'
      return false
    }

    permissionStatus.value = 'requesting'
    lastError.value = null

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Succès
          permissionStatus.value = 'granted'
          localStorage.setItem('geolocation-permission-status', 'granted')
          userPosition.value = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }

          // Marquer que le centrage initial a été vérifié
          if (!hasTriggeredInitialCentering.value) {
            hasTriggeredInitialCentering.value = true
          }

          resolve(true)
        },
        (error) => {
          // Erreur
          permissionStatus.value = 'denied'
          localStorage.setItem('geolocation-permission-status', 'denied')
          switch (error.code) {
            case error.PERMISSION_DENIED:
              lastError.value = "Permission refusée par l'utilisateur"
              break
            case error.POSITION_UNAVAILABLE:
              lastError.value = 'Position non disponible'
              break
            case error.TIMEOUT:
              lastError.value = "Délai d'attente dépassé"
              break
            default:
              lastError.value = 'Erreur de géolocalisation inconnue'
              break
          }
          resolve(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      )
    })
  }

  function startWatching() {
    if (!hasPermission.value || isWatching.value) return

    watchId.value = navigator.geolocation.watchPosition(
      (position) => {
        userPosition.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
      },
      (error) => {
        console.error('Erreur de suivi de position:', error)
        lastError.value = 'Erreur lors du suivi de position'
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000,
      },
    )

    isWatching.value = true
  }

  function stopWatching() {
    if (watchId.value !== null) {
      navigator.geolocation.clearWatch(watchId.value)
      watchId.value = null
    }
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

  function initializeGeolocation() {
    // Si on a déjà la permission, essayer de récupérer la position
    if (permissionStatus.value === 'granted') {
      // Essayer de récupérer la position sans redemander la permission
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            userPosition.value = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }
          },
          (error) => {
            // Si erreur, remettre le status à unknown pour redemander
            if (error.code === error.PERMISSION_DENIED) {
              permissionStatus.value = 'unknown'
              localStorage.removeItem('geolocation-permission-status')
            }
          },
        )
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
