/**
 * Types pour les données de l'application (structure data.json)
 */

import type { Place, MapConfig } from './map'

/**
 * Configuration de l'application
 */
export interface AppConfig {
  /** Configuration de la carte */
  map: MapConfig;
  /** Langue par défaut (code ISO 639-1: fr, en, es, etc.) */
  defaultLanguage: string;
  /** Langues disponibles */
  availableLanguages: string[];
}

/**
 * Structure complète du fichier data.json
 */
export interface AppData {
  places: Place[];
  config: AppConfig;
}
