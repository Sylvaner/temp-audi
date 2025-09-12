/**
 * Types carte minimalistes (basés sur data.json existant)
 */

import type { Position } from './geolocation'

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
