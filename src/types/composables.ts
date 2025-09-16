/**
 * Types pour les composables et références externes
 */

import type L from 'leaflet'
import type { Position, Place } from './map'

// ==========================================
// RÉFÉRENCES LEAFLET
// ==========================================

/**
 * Interface pour la référence à une carte Leaflet
 */
export interface LeafletMapRef {
  value: {
    centerOnUser(): void
    setView(position: Position, zoom: number): void
    getMap(): L.Map | null
  } | null
}

/**
 * Interface étendue pour la carte Leaflet avec plus de méthodes
 */
export interface ExtendedLeafletMapRef extends LeafletMapRef {
  value: {
    centerOnUser(): void
    setView(position: Position, zoom: number): void
    getMap(): L.Map | null
    flyTo?(position: Position, zoom?: number): void
    panTo?(position: Position): void
  } | null
}

// ==========================================
// DONNÉES ET COLLECTIONS
// ==========================================

/**
 * Interface pour les données de lieux
 */
export interface PlacesData {
  places: Place[]
}

/**
 * Interface pour une collection de lieux avec métadonnées
 */
export interface PlaceCollection {
  places: Place[]
  total: number
  filtered: number
}

// ==========================================
// ÉTATS ET STATUTS
// ==========================================

/**
 * État de chargement générique
 */
export interface LoadingState {
  isLoading: boolean
  error: string | null
}

/**
 * État avec données et chargement
 */
export interface DataState<T> extends LoadingState {
  data: T | null
}

/**
 * État de géolocalisation
 */
export interface GeolocationState extends LoadingState {
  position: Position | null
  accuracy: number | null
  hasPermission: boolean
  isSupported: boolean
}

/**
 * État de lecture audio
 */
export interface AudioPlaybackState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
}

// ==========================================
// CONFIGURATION
// ==========================================

/**
 * Configuration de base
 */
export interface BaseConfig {
  defaultLanguage: string
  availableLanguages: string[]
}

/**
 * Configuration des marqueurs étendue
 */
export interface MarkersStyleConfig {
  defaultColor: string
  defaultPlaceIcon: string
  defaultUserLocationIcon: string
  defaultUserLocationColor: string
}

/**
 * Configuration complète de l'application (pour useConfig)
 */
export interface AppConfiguration {
  siteName: Record<string, string>
  map: {
    center: {
      latitude: number
      longitude: number
    }
    zoom: number
    goToInitialUserLocation?: {
      enable: boolean
      threshold: number
      increaseZoom: number
    }
  }
  defaultLanguage: string
  availableLanguages: string[]
  markers?: MarkersStyleConfig
  markerStyle?: MarkersStyleConfig
}

// ==========================================
// UTILITAIRES
// ==========================================

/**
 * Configuration de langue (pour utilitaires)
 */
export type LanguageConfig = BaseConfig

/**
 * Configuration géolocalisation (pour store)
 */
export interface GeolocationConfig {
  enableHighAccuracy: boolean
  timeout: number
  maximumAge: number
}

// ==========================================
// ÉVÉNEMENTS
// ==========================================

/**
 * Événement de clic sur la carte Leaflet
 */
export interface MapClickEvent {
  latlng: Position
}
