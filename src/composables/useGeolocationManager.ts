/**
 * Composable pour la gestion des permissions et requêtes de géolocalisation
 * Sépare la logique technique de géolocalisation de l'état du store
 */

export interface GeolocationManagerOptions {
  onPositionUpdate: (position: Position) => void
  onPermissionChange: (status: 'granted' | 'denied') => void
  onError: (error: string) => void
}

export interface GeolocationManager {
  requestPermission: () => Promise<boolean>
  startWatching: () => boolean
  stopWatching: () => void
  getCurrentPosition: () => Promise<Position | null>
  isAvailable: boolean
}

interface Position {
  latitude: number
  longitude: number
}

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
 * Crée un gestionnaire de géolocalisation
 */
export function useGeolocationManager(options: GeolocationManagerOptions): GeolocationManager {
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
