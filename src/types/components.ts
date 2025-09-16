/**
 * Types pour les props et interfaces des composants
 */

import type L from 'leaflet'
import type { Place, Position } from './map'
import type { MapClickEvent } from './composables'

// ==========================================
// PROPS GÉNÉRIQUES
// ==========================================

/**
 * Props de base pour les composants avec un lieu
 */
export interface PlaceProps {
  place: Place
}

/**
 * Props avec position géographique
 */
export interface PositionProps {
  center?: Position
  zoom?: number
  userPosition?: Position | null
}

// ==========================================
// COMPOSANTS MAP
// ==========================================

/**
 * Props pour LeafletMap
 */
export interface LeafletMapProps extends PositionProps {
  showUserPosition?: boolean
}

/**
 * Props pour PlacePopup
 */
export interface PlacePopupProps extends PlaceProps {
  onClose?: () => void
}

/**
 * Props pour PlaceContent
 */
export interface PlaceContentProps {
  place: Place
  onClose?: () => void
}

/**
 * Props pour PlaceImage
 */
export interface PlaceImageProps {
  imageFile?: string
  title: string
}

/**
 * Props pour PlaceAudioControl
 */
export interface PlaceAudioControlProps {
  placeId: string
  audioFile: string
  isPlaying: boolean
  isLoading: boolean
  hasBeenPlayed: boolean
}

// ==========================================
// COMPOSANTS UI
// ==========================================

/**
 * Props pour PlaceAudioControls
 */
export interface PlaceAudioControlsProps {
  placeId: string
  audioFile: string
}

/**
 * Props pour GeolocationButton
 */
export interface GeolocationButtonProps {
  showText?: boolean
  size?: 'small' | 'normal' | 'medium' | 'large'
}

/**
 * Props pour GeolocationModal
 */
export interface GeolocationModalProps {
  isVisible: boolean
  type: 'request' | 'denied'
}

// ==========================================
// EXTENSIONS LEAFLET
// ==========================================

/**
 * Extension du type Marker de Leaflet pour inclure placeId
 */
export interface ExtendedMarker extends L.Marker {
  placeId?: string
}

// ==========================================
// ÉVÉNEMENTS
// ==========================================

/**
 * Émissions communes des composants carte
 */
export interface MapEmits {
  mapReady: [map: L.Map]
  mapClick: [event: MapClickEvent]
  placeDetails: [place: Place]
}

/**
 * Émissions pour les composants de lieu
 */
export interface PlaceEmits {
  click: []
  close: []
  select: [place: Place]
}
