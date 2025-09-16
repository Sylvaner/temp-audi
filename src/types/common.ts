/**
 * Types génériques et utilitaires pour l'application
 */

// ==========================================
// ÉTATS ET STATUTS GÉNÉRIQUES
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

// ==========================================
// CONFIGURATION GÉNÉRIQUE
// ==========================================

/**
 * Configuration de base
 */
export interface BaseConfig {
  defaultLanguage: string
  availableLanguages: string[]
}

/**
 * Configuration de langue (pour utilitaires)
 */
export type LanguageConfig = BaseConfig

/**
 * Configuration des marqueurs étendue
 */
export interface MarkersStyleConfig {
  defaultColor: string
  defaultPlaceIcon: string
  defaultUserLocationIcon: string
  defaultUserLocationColor: string
}
