/**
 * Types géolocalisation minimalistes (basés sur data.json existant)
 */

/**
 * Position géographique
 */
export interface Position {
  latitude: number
  longitude: number
}

/**
 * État de géolocalisation
 */
export interface GeolocationState {
  isLoading: boolean
  error: string | null
  position: Position | null
  accuracy: number | null
  hasPermission: boolean
  isSupported: boolean
}

/**
 * Configuration géolocalisation (pour store)
 */
export interface GeolocationConfig {
  enableHighAccuracy: boolean
  timeout: number
  maximumAge: number
}
