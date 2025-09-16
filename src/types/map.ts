/**
 * Types carte minimalistes (basés sur data.json existant)
 */

import type L from 'leaflet'
import type { Position } from './geolocation'

// Ré-export des types de base
export type { Position } from './geolocation'

/**
 * Contenu localisé d'un lieu
 */
export interface PlaceContent {
  title: string
  description: string
  text: string
  audioFile: string
}

/**
 * Place/lieu avec contenu multilingue
 */
export interface Place {
  id: string
  order?: number // Ordre d'affichage des lieux (optionnel)
  latitude: number
  longitude: number
  content: Record<string, PlaceContent> // clé = code langue (fr, en, es, etc.)
  imageFile?: string
  markerColor?: string // Couleur personnalisée pour le marqueur (CSS color value)
  markerIcon?: string // Icône personnalisée pour le marqueur (classe FontAwesome)
}

/**
 * Configuration de la carte
 */
export interface MapConfig {
  center: Position
  zoom: number
}

/**
 * Événement de clic sur la carte Leaflet
 */
export interface MapClickEvent {
  latlng: Position
}

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
 * Interface pour les données de lieux
 */
export interface PlacesData {
  places: Place[]
}
