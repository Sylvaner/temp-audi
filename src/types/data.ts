/**
 * Types pour les données de l'application (structure data.json)
 */

import type { Place, MapConfig } from './map'

/**
 * Configuration des marqueurs
 */
export interface MarkersConfig {
  /** Couleur par défaut des marqueurs */
  defaultColor: string
  /** Icône pour les lieux */
  place: string
  /** Icône pour la position de l'utilisateur */
  userLocation: string
}

/**
 * Configuration de l'application
 */
export interface AppConfig {
  /** Configuration de la carte */
  map: MapConfig
  /** Langue par défaut (code ISO 639-1: fr, en, es, etc.) */
  defaultLanguage: string
  /** Langues disponibles */
  availableLanguages: string[]
  /** Configuration des marqueurs */
  markers?: MarkersConfig
}

/**
 * Structure complète du fichier data.json
 */
export interface AppData {
  places: Place[]
  config: AppConfig
}
