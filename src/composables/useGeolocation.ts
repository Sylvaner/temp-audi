/**
 * Composable unifié pour la gestion complète de la géolocalisation
 * Combine la gestion des permissions, le suivi de position et les calculs géographiques
 */

import { computed, type Ref } from 'vue'
import type { Position } from '@/types/geolocation'

/**
 * Options pour le composable de géolocalisation unifié
 */
export type GeolocationOptions = {
  // Callbacks pour les événements de position
  onPositionUpdate: (position: Position) => void
  onPermissionChange: (status: 'granted' | 'denied') => void
  onError: (error: string) => void
  
  // Configuration pour les calculs géographiques
  mapCenter: Position
  threshold: number
  increaseZoom: number
  baseZoom: number
}

/**
 * Interface du composable de géolocalisation unifié
 */
export type Geolocation = {
  // Gestion des permissions et du suivi
  requestPermission: () => Promise<boolean>
  startWatching: () => boolean
  stopWatching: () => void
  getCurrentPosition: () => Promise<Position | null>
  isAvailable: boolean
  
  // Calculs géographiques
  distanceToCenter: Ref<number>
  isUserInArea: Ref<boolean>
  shouldCenterOnUser: Ref<boolean>
  increasedZoom: Ref<number>
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number
}

// Configuration par défaut pour les requêtes de géolocalisation
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
 * Composable unifié de géolocalisation
 * Gère à la fois les permissions, le suivi de position et les calculs géographiques
 * 
 * @param userPosition - Référence réactive vers la position de l'utilisateur
 * @param options - Configuration du composable
 * @returns Interface complète de géolocalisation
 */
export function useGeolocation(
  userPosition: Ref<Position | null>,
  options: GeolocationOptions,
): Geolocation {
  const { 
    onPositionUpdate, 
    onPermissionChange, 
    onError,
    mapCenter,
    threshold,
    increaseZoom,
    baseZoom,
  } = options

  // ============================================================================
  // PARTIE 1 : GESTION DES PERMISSIONS ET DU SUIVI
  // ============================================================================
  
  let watchId: number | null = null
  const isAvailable = 'geolocation' in navigator

  /**
   * Convertit une erreur de géolocalisation en message lisible
   */
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

  /**
   * Convertit une position de l'API de géolocalisation en notre format
   */
  const convertPosition = (geoPosition: GeolocationPosition): Position => ({
    latitude: geoPosition.coords.latitude,
    longitude: geoPosition.coords.longitude,
  })

  /**
   * Demande la permission de géolocalisation et récupère la position
   */
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

  /**
   * Récupère la position actuelle de l'utilisateur
   */
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

  /**
   * Démarre le suivi de la position de l'utilisateur
   */
  const startWatching = (): boolean => {
    if (!isAvailable || watchId !== null) {
      return false
    }

    watchId = navigator.geolocation.watchPosition(
      (position) => {
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

    return true
  }

  /**
   * Arrête le suivi de la position
   */
  const stopWatching = (): void => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      watchId = null
    }
  }

  // ============================================================================
  // PARTIE 2 : CALCULS GÉOGRAPHIQUES
  // ============================================================================

  /**
   * Calcule la distance euclidienne entre deux points géographiques (en degrés)
   * NOTE: Il s'agit d'une approximation simplifiée, pas d'une vraie distance géographique.
   * Pour de petites distances, cela suffit. Pour plus de précision, utiliser la formule de Haversine.
   * 
   * @param lat1 - Latitude du premier point
   * @param lon1 - Longitude du premier point
   * @param lat2 - Latitude du second point
   * @param lon2 - Longitude du second point
   * @returns Distance approximative en degrés
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

  // ============================================================================
  // RETOUR DE L'INTERFACE UNIFIÉE
  // ============================================================================

  return {
    // Gestion des permissions et du suivi
    requestPermission,
    startWatching,
    stopWatching,
    getCurrentPosition,
    isAvailable,
    
    // Calculs géographiques
    distanceToCenter,
    isUserInArea,
    shouldCenterOnUser,
    increasedZoom,
    calculateDistance,
  }
}