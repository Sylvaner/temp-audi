/**
 * Types pour les données de l'application (structure data.json)
 */

import type { Place, MapConfig } from './map'
import type { MarkersStyleConfig } from './common'

/**
 * Configuration de l'application
 */
export interface AppConfig {
  /** Nom du site multilingue */
  siteName: Record<string, string>
  /** Configuration de la carte */
  map: MapConfig & {
    goToInitialUserLocation?: {
      enable: boolean
      threshold: number
      increaseZoom: number
    }
  }
  /** Langue par défaut (code ISO 639-1: fr, en, es, etc.) */
  defaultLanguage: string
  /** Langues disponibles */
  availableLanguages: string[]
  /** Configuration des marqueurs */
  markers?: MarkersStyleConfig
}

/**
 * Structure complète du fichier data.json
 */
export interface AppData {
  places: Place[]
  config: AppConfig
}
