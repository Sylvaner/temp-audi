/**
 * Composable fusionné pour la gestion de la géolocalisation
 * Combine les fonctionnalités de gestion et de calcul géographique
 */

import { computed, type Ref } from 'vue'

// Types simplifiés
export type Position = {
  latitude: number
  longitude: number
}

export type GeolocationOptions = {
  onPositionUpdate: (position: Position) => void
  onPermissionChange: (status: 'granted' | 'denied') => void
  onError: (error: string) => void
}

export type GeolocationCalculatorOptions = {
  userPosition: Ref<Position | null>
  mapCenter: Position
  threshold: number
  increaseZoom: number
  baseZoom: number
}

export type GeolocationManager = {
  requestPermission: () => Promise<boolean>
  startWatching: () => boolean
  stopWatching: () => void
  getCurrentPosition: () => Promise<Position | null>
  isAvailable: boolean
}

export type GeolocationCalculator = {
  distanceToCenter: Ref<number>
  isUserInArea: Ref<boolean>
  shouldCenterOnUser: Ref<boolean>
  increasedZoom: Ref<number>
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number
}

// Configuration par défaut
const DEFAULT_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 60000,
}

const WATCH_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 30000,
}

/**
 * Gestionnaire de géolocalisation (permissions et requêtes)
 */
export function useGeolocationManager(options: GeolocationOptions): GeolocationManager {
  const { onPositionUpdate, onPermissionChange, onError } = options
  let watchId: number | null = null

  const isAvailable = 'geolocation' in navigator

  const convertGeolocationError = (error: GeolocationPositionError): string => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "Permission refusée par l'utilisateur"
      case error.POSITION_UNAVAILABLE:
        return 'Position non disponible'
      case error.TIMEOUT:
        return "Délai d'attente dépassé"
      default:
        return 'Erreur de géolocalisation inconnue'
    }
  }

  const convertPosition = (geoPosition: GeolocationPosition): Position => ({
    latitude: geoPosition.coords.latitude,
    longitude: geoPosition.coords.longitude,
  })

  const requestPermission = async (): Promise<boolean> => {
    if (!isAvailable) {
      onError('Géolocalisation non disponible sur ce navigateur')
      return false
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const convertedPosition = convertPosition(position)
          onPositionUpdate(convertedPosition)
          onPermissionChange('granted')
          resolve(true)
        },
        (error) => {
          onError(convertGeolocationError(error))
          onPermissionChange('denied')
          resolve(false)
        },
        DEFAULT_OPTIONS,
      )
    })
  }

  const getCurrentPosition = async (): Promise<Position | null> => {
    if (!isAvailable) {
      onError('Géolocalisation non disponible sur ce navigateur')
      return null
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const convertedPosition = convertPosition(position)
          resolve(convertedPosition)
        },
        (error) => {
          onError(convertGeolocationError(error))
          resolve(null)
        },
        DEFAULT_OPTIONS,
      )
    })
  }

  const startWatching = (): boolean => {
    if (!isAvailable || watchId !== null) {
      return false
    }

    console.log('Démarrage du suivi de géolocalisation...')

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        console.log('Nouvelle position reçue:', position.coords)
        const convertedPosition = convertPosition(position)
        onPositionUpdate(convertedPosition)
      },
      (error) => {
        console.error('Erreur de suivi de position:', error)
        onError('Erreur lors du suivi de position')

        // Si l'erreur est due aux permissions, arrêter le suivi
        if (error.code === error.PERMISSION_DENIED) {
          stopWatching()
          onPermissionChange('denied')
        }
      },
      WATCH_OPTIONS,
    )

    console.log('Suivi de géolocalisation démarré')
    return true
  }

  const stopWatching = (): void => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      watchId = null
    }
  }

  return {
    requestPermission,
    startWatching,
    stopWatching,
    getCurrentPosition,
    isAvailable,
  }
}

/**
 * Calculateur géographique pour les distances et centrage
 */
export function useGeolocationCalculator(
  options: GeolocationCalculatorOptions,
): GeolocationCalculator {
  const { userPosition, mapCenter, threshold, increaseZoom, baseZoom } = options

  /**
   * Calcule la distance entre deux points géographiques (en degrés)
   */
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const deltaLat = Math.abs(lat1 - lat2)
    const deltaLon = Math.abs(lon1 - lon2)
    return Math.sqrt(deltaLat * deltaLat + deltaLon * deltaLon)
  }

  /**
   * Distance actuelle de l'utilisateur au centre de la carte
   */
  const distanceToCenter = computed(() => {
    if (!userPosition.value) return Infinity

    return calculateDistance(
      userPosition.value.latitude,
      userPosition.value.longitude,
      mapCenter.latitude,
      mapCenter.longitude,
    )
  })

  /**
   * Vérifie si l'utilisateur est dans la zone du centre de la carte
   */
  const isUserInArea = computed(() => {
    if (!userPosition.value) return false

    const distance = distanceToCenter.value
    console.log('Distance to initial center:', distance)
    console.log('Threshold:', threshold)
    console.log('Is user in initial area:', distance <= threshold)

    return distance <= threshold
  })

  /**
   * Détermine si on doit centrer automatiquement sur l'utilisateur
   */
  const shouldCenterOnUser = computed(() => {
    return isUserInArea.value
  })

  /**
   * Zoom augmenté pour le centrage sur l'utilisateur
   */
  const increasedZoom = computed(() => {
    return baseZoom + increaseZoom
  })

  return {
    distanceToCenter,
    isUserInArea,
    shouldCenterOnUser,
    increasedZoom,
    calculateDistance,
  }
}
