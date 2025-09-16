/**
 * Types pour les données de l'application (structure data.json)
 */

import type { Place, MapConfig } from './map'
import type { MarkersStyleConfig } from './common'

/**
 * Configuration des marqueurs (version legacy - à migrer)
 * @deprecated Utiliser MarkersStyleConfig
 */
export interface MarkersConfig {
  /** Couleur par défaut des marqueurs */
  defaultColor: string
  /** Icône pour les lieux */
  defaultPlaceIcon: string
  /** Icône pour la position de l'utilisateur */
  defaultUserLocationIcon: string
  /** Couleur pour la position de l'utilisateur */
  defaultUserLocationColor: string
}

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
  markers?: MarkersConfig | MarkersStyleConfig
}

/**
 * Structure complète du fichier data.json
 */
export interface AppData {
  places: Place[]
  config: AppConfig
}
